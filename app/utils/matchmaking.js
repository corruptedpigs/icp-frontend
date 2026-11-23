import { createConsumer } from '@rails/actioncable';
import { withSimulationParam } from './gameApi';

export const DEFAULT_MATCH_TIMEOUT_MS = 90000;

/** Wait for an opponent; override with NEXT_PUBLIC_MATCHMAKING_TIMEOUT_MS (tests). */
export function getMatchTimeoutMs() {
  const value = Number(process.env.NEXT_PUBLIC_MATCHMAKING_TIMEOUT_MS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_MATCH_TIMEOUT_MS;
}

export function getCableUrl(apiUrl) {
  const url = new URL('/cable', apiUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.href;
}

export function waitForCableMatch({ apiUrl, token, signal, timeoutMessage, failureMessage }) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('Matchmaking cancelled'));
      return;
    }
    const consumer = createConsumer(withSimulationParam(process.env.NEXT_PUBLIC_GAME_CABLE_URL || getCableUrl(apiUrl)));
    let subscription;
    let settled = false;
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
    const timer = setTimeout(() => finish(new Error(timeoutMessage)), getMatchTimeoutMs());
    signal.addEventListener('abort', cancel, { once: true });
    try {
      subscription = consumer.subscriptions.create({ channel: 'MatchmakingChannel', token }, {
        received(data) {
          if (data?.type === 'matched' && data.session_id) finish(null, { ...data, matched: true });
        },
        rejected() { finish(new Error(failureMessage)); },
        // Action Cable reconnects automatically. The server replays an existing
        // match on subscription; the timeout also bounds connection failures.
      });
    } catch (error) {
      finish(error);
    }
  });
}
