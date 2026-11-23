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
 * 6. Else subscribe to MatchmakingChannel until `matched` or `expired` arrives.
 *    The local timer comes from the server (`expires_at − server_time`); when
 *    it fires, GET /game_sessions/:id decides. The server is the only authority.
 *
 * Returns an object:
 * { joinGame(), isLoading, isWaiting, error, token, match }
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { waitForCableMatch, getWaitMs, getExpiryDeadline, withClockOffset } from '../utils/matchmaking';
import { useWallet } from "../context/WalletContext";
import { useTranslations } from "../components/LanguageContext";
import { getAddress, verifyMessage } from "ethers";
import { GAME_API_BASE, fetchGameApi, readJson, fetchSimulatedToken } from "../utils/gameApi";
import { isSimulation } from "../utils/simulation";
import { useSimulation } from "../context/SimulationContext";

const GAME_TYPE = "logic";

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

/** GET /game_sessions/:id — the server's current view of a session. */
export async function fetchGameSession(sessionId, bearerToken, t) {
  const res = await fetchGameApi(`/api/v1/game_sessions/${encodeURIComponent(sessionId)}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearerToken}` },
  }, t("game.errors.serviceUnavailable"));
  if (!res.ok) throw new Error(t("game.errors.matchStatus"));
  return readJson(res, t("game.errors.matchStatus"));
}

export function useJoinGame() {
  const { provider, account, chainId } = useWallet();
  const { t } = useTranslations();
  const { simulation: simulationOn } = useSimulation();
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState(null);
  // Tokens are kept per mode so a simulated token is never sent on real
  // requests (and vice versa).
  const [tokens, setTokens] = useState({ real: null, sim: null });
  const [match, setMatch] = useState(null);
  const [waitingUntil, setWaitingUntil] = useState(null); // client-clock ms
  const pendingWait = useRef(null);

  useEffect(() => () => pendingWait.current?.abort(), [account, provider]);

  // Switching mode drops any in-flight matchmaking and the previous match.
  useEffect(() => {
    pendingWait.current?.abort();
    setMatch(null);
    setError(null);
    setIsWaiting(false);
    setWaitingUntil(null);
  }, [simulationOn]);

  const joinGame = useCallback(async () => {
    const simulation = isSimulation();
    const mode = simulation ? "sim" : "real";
    if (!account || (!simulation && !provider)) {
      throw new Error(t("game.errors.walletNotConnected"));
    }

    setIsLoading(true);
    setError(null);

    try {
      let bearerToken;
      if (simulation) {
        // Simulation: no nonce/SIWE; the backend issues a token for the wallet.
        bearerToken = await fetchSimulatedToken(account, {
          unavailable: t("game.errors.serviceUnavailable"),
          failure: t("game.errors.walletVerification"),
        });
      } else {
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
        bearerToken = verifyData.token;
        if (!bearerToken) {
          throw new Error(t("game.errors.walletVerification"));
        }
      }
      setTokens((prev) => ({ ...prev, [mode]: bearerToken }));

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
        const ready = withClockOffset(matchData);
        setMatch(ready);
        return { token: bearerToken, match: ready, matched: true };
      }
      // Else wait for opponent
      if (!matchData.matchmaking_token) throw new Error(t('game.errors.matchmaking'));
      const sessionId = matchData.public_id || matchData.session_id || matchData.id;
      const received = Date.now();
      setWaitingUntil(getExpiryDeadline(matchData, received));
      setIsWaiting(true);
      const controller = new AbortController();
      pendingWait.current?.abort(); // re-join replaces any earlier wait
      pendingWait.current = controller;
      const checkSession = async () => {
        if (!sessionId) return { status: "waiting" };
        const state = await fetchGameSession(sessionId, bearerToken, t);
        const now = Date.now();
        setWaitingUntil(getExpiryDeadline(state, now));
        return { ...withClockOffset(state, now), nextWaitMs: getWaitMs(state, now) ?? undefined };
      };
      const waitingMatch = await waitForCableMatch({
        apiUrl: GAME_API_BASE,
        token: matchData.matchmaking_token,
        signal: controller.signal,
        timeoutMs: getWaitMs(matchData, received),
        checkSession,
        timeoutMessage: t('game.errors.opponentTimeout'),
        expiredMessage: t('game.errors.opponentTimeout'),
        failureMessage: t('game.errors.matchmaking'),
      });
      if (pendingWait.current === controller) pendingWait.current = null;
      const ready = waitingMatch.clock_offset_ms === undefined
        ? withClockOffset(waitingMatch)
        : waitingMatch;
      setMatch(ready);
      return { token: bearerToken, match: ready, matched: true };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsWaiting(false);
      setWaitingUntil(null);
      setIsLoading(false);
    }
  }, [provider, account, chainId, t]);

  const token = tokens[simulationOn ? "sim" : "real"];
  return { joinGame, isLoading, isWaiting, waitingUntil, error, token, match };
}

