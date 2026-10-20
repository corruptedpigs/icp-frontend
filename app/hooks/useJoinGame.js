"use client";

/**
 * useJoinGame hook for Next.js frontend.
 *
 * Flow:
 * 1. GET /api/v1/players/:wallet/nonce   → obtain server-provided nonce.
 * 2. Sign an EIP‑4361 (SIWE) message with that nonce.
 * 3. POST /api/v1/auth/verify { message, signature } → bearer token.
 * 4. POST /api/v1/matchmaking { game_type } with Authorization header.
 * 5. If the response indicates a match already exists (matched:true or vs_cpu)
 *    → return immediately.
 * 6. Else poll GET /api/v1/game_sessions/:session_id every 2 s until the
 *    session becomes matched or active, or until a 90 s timeout.
 *
 * Returns an object:
 * { joinGame(), isLoading, isWaiting, error, token, match }
 */

import { useState, useCallback } from "react";
import { useWallet } from "../context/WalletContext";
import { getAddress, verifyMessage } from "ethers";

const GAME_API_BASE = process.env.NEXT_PUBLIC_GAME_API_URL || "http://localhost:3000";
const GAME_TYPE = "logic";
const POLL_INTERVAL_MS = 2000;
const MAX_WAIT_ATTEMPTS = 45; // ~90 seconds

/** Builds an EIP‑4361 (SIWE) plain‑text message. */
function buildSiweMessage({ domain, address, uri, chainId, nonce, issuedAt }) {
  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    "",
    "Sign in with Ethereum",
    "",
    `URI: ${uri}`,
    `Version: 1`,
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}

/** Fetches the server‑issued nonce for a wallet. */
async function fetchServerNonce(walletAddress) {
  const res = await fetch(
    `${GAME_API_BASE}/api/v1/players/${walletAddress.toLowerCase()}/nonce`
  );
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch nonce (${res.status}): ${text}`);
  }
  const data = await res.json();
  if (!data.nonce) {
    throw new Error("Nonce response did not include a nonce");
  }
  return data.nonce;
}

/** Polls the game session until a match is ready or timeout. */
async function waitForMatch(sessionId, bearerToken) {
  const poll = async (attempt = 0) => {
    if (attempt > MAX_WAIT_ATTEMPTS) {
      throw new Error("No opponent joined within the allowed time.");
    }
    const res = await fetch(`${GAME_API_BASE}/api/v1/game_sessions/${sessionId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      // Defensive checks for backend response.
      if (data.matched || data.status === "active" || data.status === "matched" || data.vs_cpu) {
        return data;
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    return poll(attempt + 1);
  };
  return poll();
}

export function useJoinGame() {
  const { provider, account, chainId } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [match, setMatch] = useState(null);

  const joinGame = useCallback(async () => {
    if (!provider || !account) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get server nonce
      const nonce = await fetchServerNonce(account);
      // Use the address from the signer itself. Wallet context state can be
      // stale after switching accounts/providers in an injected wallet.
      const signer = await provider.getSigner();
      const signerAddress = getAddress(await signer.getAddress());
      if (signerAddress.toLowerCase() !== account.toLowerCase()) {
        throw new Error("Connected wallet account changed. Reconnect your wallet and try again.");
      }

      // 2. Build & sign SIWE message
      const domain = typeof window !== "undefined" ? window.location.host : "corruptedpigs.com";
      const uri = typeof window !== "undefined" ? window.location.origin : `https://${domain}`;
      const issuedAt = new Date().toISOString();
      const message = buildSiweMessage({
        domain,
        address: signerAddress,
        uri,
        chainId: chainId ?? 137,
        nonce,
        issuedAt,
      });
      // ethers handles wallet-specific personal_sign encoding and address
      // formatting. Manually issuing personal_sign then falling back to this
      // call duplicated the same request and could pass a mismatched address.
      const signature = await signer.signMessage(message);
      const recoveredAddress = getAddress(verifyMessage(message, signature));
      if (recoveredAddress !== signerAddress) {
        throw new Error("Wallet signed with a different account. Reconnect the intended account and try again.");
      }

      // 3. Verify auth
      const verifyRes = await fetch(`${GAME_API_BASE}/api/v1/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) {
        const text = await verifyRes.text().catch(() => verifyRes.statusText);
        throw new Error(`Auth verify failed (${verifyRes.status}): ${text}`);
      }
      const verifyData = await verifyRes.json();
      const bearerToken = verifyData.token;
      if (!bearerToken) {
        throw new Error("Auth verify response did not include a token");
      }
      setToken(bearerToken);

      // 4. Join matchmaking
      const matchRes = await fetch(`${GAME_API_BASE}/api/v1/matchmaking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ game_type: GAME_TYPE }),
      });
      if (!matchRes.ok) {
        const text = await matchRes.text().catch(() => matchRes.statusText);
        throw new Error(`Matchmaking failed (${matchRes.status}): ${text}`);
      }
      const matchData = await matchRes.json();

      // Immediate match? start game.
      if (matchData.matched || matchData.vs_cpu) {
        setMatch(matchData);
        return { token: bearerToken, match: matchData, matched: true };
      }
      // Else wait for opponent
      setIsWaiting(true);
      const waitingMatch = await waitForMatch(matchData.session_id, bearerToken);
      setIsWaiting(false);
      setMatch(waitingMatch);
      return { token: bearerToken, match: waitingMatch, matched: true };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [provider, account, chainId]);

  return { joinGame, isLoading, isWaiting, error, token, match };
}

export { waitForMatch };
