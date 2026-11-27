import { createConsumer } from '@rails/actioncable';
import { withSimulationParam } from './gameApi';

// Small allowance so the server's own `expired`/`matched` event wins the race
// against the local timer. The real duration always comes from the server.
export const TIMEOUT_GRACE_MS = 1500;
// Pause before re-checking a session the server still reports as waiting.
export const RECHECK_MS = 2000;

/** Server timestamps may be ISO strings, epoch seconds or epoch ms. */
export function toMs(value) {
  if (value === null || value === undefined || value === '') return NaN;
  const number = Number(value);
  if (Number.isFinite(number)) return number < 1e12 ? number * 1000 : number;
  return Date.parse(value);
}

/** server_time − Date.now(); 0 when the server sent no usable time. */
export function clockOffset(serverTime, now = Date.now()) {
  const server = toMs(serverTime);
  return Number.isFinite(server) ? server - now : 0;
}

/** Converts a server timestamp to the client's clock. */
export function toClientMs(serverTimestamp, offset) {
  const ms = toMs(serverTimestamp);
  return Number.isFinite(ms) ? ms - offset : NaN;
}

/** Tags a server payload with the clock offset measured when it arrived. */
export function withClockOffset(data, now = Date.now()) {
  return { ...data, clock_offset_ms: clockOffset(data?.server_time, now) };
}

/** Client-clock deadline (ms) at which the server expires the waiting session, or null. */
export function getExpiryDeadline(data, now = Date.now()) {
  const override = Number(process.env.NEXT_PUBLIC_MATCHMAKING_TIMEOUT_MS);
  if (Number.isFinite(override) && override > 0) return now + override;
  const expires = toClientMs(data?.expires_at, clockOffset(data?.server_time, now));
  if (Number.isFinite(expires)) return expires;
  const seconds = Number(data?.matchmaking_timeout_seconds);
  return Number.isFinite(seconds) && seconds > 0 ? now + seconds * 1000 : null;
}

/** How long to wait before asking the server, or null (rely on events only). */
export function getWaitMs(data, now = Date.now()) {
  const deadline = getExpiryDeadline(data, now);
  return deadline === null ? null : Math.max(0, deadline - now) + TIMEOUT_GRACE_MS;
}

export function getCableUrl(apiUrl) {
  const url = new URL('/cable', apiUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.href;
}

/**
 * Waits for the server to match this player.
 * - `matched` cable event → resolves.
 * - `expired` cable event → rejects with `expiredMessage`.
 * - local timer (`timeoutMs`) → asks `checkSession()` for the real state:
 *   { matched | vs_cpu } resolves, { status: 'expired' } rejects, otherwise the
 *   wait continues until the server's event (re-checking after `nextWaitMs`).
 */
export function waitForCableMatch({
  apiUrl, token, signal, timeoutMs = null, checkSession,
  timeoutMessage, expiredMessage, failureMessage,
}) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('Matchmaking cancelled'));
      return;
    }
    const consumer = createConsumer(withSimulationParam(process.env.NEXT_PUBLIC_GAME_CABLE_URL || getCableUrl(apiUrl)));
    let subscription;
    let settled = false;
    let timer;
    const finish = (error, match) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener('abort', cancel);
      subscription?.unsubscribe();
      consumer.disconnect();
      if (error) reject(error);
      else resolve(match);
    };
    const cancel = () => finish(new Error('Matchmaking cancelled'));
    const arm = (ms) => {
      if (ms === null || ms === undefined) return;
      clearTimeout(timer);
      timer = setTimeout(onTimer, ms);
    };
    const onTimer = async () => {
      if (settled) return;
      if (!checkSession) return finish(new Error(timeoutMessage || expiredMessage));
      try {
        const state = await checkSession();
        if (settled) return;
        if (state?.matched || state?.vs_cpu) finish(null, { ...state, matched: true });
        else if (state?.status === 'expired') finish(new Error(expiredMessage || timeoutMessage));
        else arm(Math.max(state?.nextWaitMs ?? RECHECK_MS, RECHECK_MS));
      } catch (error) {
        finish(error);
      }
    };
    arm(timeoutMs);
    signal.addEventListener('abort', cancel, { once: true });
    try {
      subscription = consumer.subscriptions.create({ channel: 'MatchmakingChannel', token }, {
        received(data) {
          if (data?.type === 'matched' && data.session_id) finish(null, { ...data, matched: true });
          else if (data?.type === 'expired') finish(new Error(expiredMessage || timeoutMessage));
        },
        rejected() { finish(new Error(failureMessage)); },
        // Action Cable reconnects automatically and the server replays the
        // current state on subscription; the timer bounds connection failures.
      });
    } catch (error) {
      finish(error);
    }
  });
}
