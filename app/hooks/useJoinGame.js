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
 * 6. Else subscribe to MatchmakingChannel until a matched event arrives,
 *    or until a 90 s timeout. The polling helper below is retained for reuse,
 *    but is not used by this flow.
 *
 * Returns an object:
 * { joinGame(), isLoading, isWaiting, error, token, match }
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { waitForCableMatch } from '../utils/matchmaking';
import { useWallet } from "../context/WalletContext";
import { useTranslations } from "../components/LanguageContext";
import { getAddress, verifyMessage } from "ethers";

const GAME_API_BASE = process.env.NEXT_PUBLIC_GAME_API_URL || "http://localhost:3000";
const GAME_TYPE = "logic";
const POLL_INTERVAL_MS = 2000;
const MAX_WAIT_ATTEMPTS = 45; // ~90 seconds
/** Fetches the API without exposing browser/network diagnostics to players. */
async function fetchGameApi(path, options, serviceUnavailableMessage) {
  let response;
  try {
    const origin = new URL(GAME_API_BASE).origin;
    response = await fetch(`${origin}${path}`, options);
  } catch {
    // Browsers report offline, DNS, CORS, and connection-refused failures as
    // generic TypeErrors (often just "Failed to fetch"). Keep that detail out
    // of the player-facing error.
    throw new Error(serviceUnavailableMessage);
  }

  if (response.status >= 500) {
    throw new Error(serviceUnavailableMessage);
  }
  return response;
}

async function readJson(response, fallbackMessage) {
  try {
    return await response.json();
  } catch {
    throw new Error(fallbackMessage);
  }
}

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
async function fetchServerNonce(walletAddress, t) {
  const res = await fetchGameApi(
    `/api/v1/players/${walletAddress.toLowerCase()}/nonce`,
    undefined,
    t("game.errors.serviceUnavailable")
  );
  if (!res.ok) {
    throw new Error(t("game.errors.signInStart"));
  }
  const data = await readJson(res, t("game.errors.signInStart"));
  if (!data.nonce) {
    throw new Error(t("game.errors.signInStart"));
  }
  return data.nonce;
}

/** Polls the game session until a match is ready or timeout. */
async function waitForMatch(sessionId, bearerToken, t) {
  const poll = async (attempt = 0) => {
    if (attempt > MAX_WAIT_ATTEMPTS) {
      throw new Error(t("game.errors.opponentTimeout"));
    }
    const res = await fetchGameApi(`/api/v1/game_sessions/${sessionId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    }, t("game.errors.serviceUnavailable"));
    if (!res.ok) {
      throw new Error(t("game.errors.matchStatus"));
    }
    const data = await readJson(res, t("game.errors.matchStatus"));
    // Defensive checks for backend response.
    if (data.matched || data.status === "active" || data.status === "matched" || data.vs_cpu) {
      return data;
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    return poll(attempt + 1);
  };
  return poll();
}

export function useJoinGame() {
  const { provider, account, chainId } = useWallet();
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [match, setMatch] = useState(null);
  const pendingWait = useRef(null);

  useEffect(() => () => pendingWait.current?.abort(), [account, provider]);

  const joinGame = useCallback(async () => {
    if (!provider || !account) {
      throw new Error(t("game.errors.walletNotConnected"));
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get server nonce
      const nonce = await fetchServerNonce(account, t);
      // Use the address from the signer itself. Wallet context state can be
      // stale after switching accounts/providers in an injected wallet.
      const signer = await provider.getSigner();
      const signerAddress = getAddress(await signer.getAddress());
      if (signerAddress.toLowerCase() !== account.toLowerCase()) {
        throw new Error(t("game.errors.walletChanged"));
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
        throw new Error(t("game.errors.signatureAccountMismatch"));
      }

      // 3. Verify auth
      const verifyRes = await fetchGameApi("/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      }, t("game.errors.serviceUnavailable"));
      if (!verifyRes.ok) {
        throw new Error(t("game.errors.walletVerification"));
      }
      const verifyData = await readJson(verifyRes, t("game.errors.walletVerification"));
      const bearerToken = verifyData.token;
      if (!bearerToken) {
        throw new Error(t("game.errors.walletVerification"));
      }
      setToken(bearerToken);

      // 4. Join matchmaking
      const matchRes = await fetchGameApi("/api/v1/matchmaking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ game_type: GAME_TYPE }),
      }, t("game.errors.serviceUnavailable"));
      if (!matchRes.ok) {
        throw new Error(t("game.errors.matchmaking"));
      }
      const matchData = await readJson(matchRes, t("game.errors.matchmaking"));

      // Immediate match? start game.
      if (matchData.matched || matchData.vs_cpu) {
        setMatch(matchData);
        return { token: bearerToken, match: matchData, matched: true };
      }
      // Else wait for opponent
      if (!matchData.matchmaking_token) throw new Error(t('game.errors.matchmaking'));
      setIsWaiting(true);
      const controller = new AbortController();
      pendingWait.current?.abort();
      pendingWait.current = controller;
      const waitingMatch = await waitForCableMatch({
        apiUrl: GAME_API_BASE,
        token: matchData.matchmaking_token,
        signal: controller.signal,
        timeoutMessage: t('game.errors.opponentTimeout'),
        failureMessage: t('game.errors.matchmaking'),
      });
      pendingWait.current = null;
      setIsWaiting(false);
      setMatch(waitingMatch);
      return { token: bearerToken, match: waitingMatch, matched: true };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsWaiting(false);
      setIsLoading(false);
    }
  }, [provider, account, chainId, t]);

  return { joinGame, isLoading, isWaiting, error, token, match };
}

export { waitForMatch };
