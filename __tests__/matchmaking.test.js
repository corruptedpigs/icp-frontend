import { createConsumer } from '@rails/actioncable';
import { getCableUrl, waitForCableMatch, getWaitMs, clockOffset, toClientMs, TIMEOUT_GRACE_MS } from '../app/utils/matchmaking';

jest.mock('@rails/actioncable', () => ({ createConsumer: jest.fn() }));

test.each([
  ['http://localhost:3000/api/v1', 'ws://localhost:3000/cable'],
  ['https://api.corruptedpigs.com/api/v1', 'wss://api.corruptedpigs.com/cable'],
  ['https://backend.trycloudflare.com', 'wss://backend.trycloudflare.com/cable'],
])('derives cable endpoint from %s', (api, cable) => {
  expect(getCableUrl(api)).toBe(cable);
});

describe('matchmaking subscription', () => {
  let callbacks;
  let consumer;
  let subscription;
  let controller;
  let checkSession;
  const start = (timeoutMs = 30000) => waitForCableMatch({
    apiUrl: 'http://localhost:3000', token: 'queue-token', signal: controller.signal,
    timeoutMs, checkSession,
    timeoutMessage: 'Timed out', expiredMessage: 'No opponent', failureMessage: 'Rejected',
  });
  beforeEach(() => {
    jest.useFakeTimers();
    controller = new AbortController();
    checkSession = jest.fn().mockResolvedValue({ status: 'expired' });
    subscription = { unsubscribe: jest.fn() };
    consumer = { disconnect: jest.fn(), subscriptions: { create: jest.fn((identifier, handlers) => {
      callbacks = handlers;
      return subscription;
    }) } };
    createConsumer.mockReturnValue(consumer);
  });
  afterEach(() => jest.useRealTimers());

  test('subscribes with queue token and resolves matched event with cleanup', async () => {
    const promise = start();
    expect(consumer.subscriptions.create).toHaveBeenCalledWith(
      { channel: 'MatchmakingChannel', token: 'queue-token' }, expect.any(Object));
    callbacks.received({ type: 'matched', session_id: 'public-id', vs_cpu: false });
    await expect(promise).resolves.toMatchObject({ matched: true, session_id: 'public-id' });
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect(consumer.disconnect).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });

  test('rejects rejected subscriptions', async () => {
    const promise = start();
    callbacks.rejected();
    await expect(promise).rejects.toThrow('Rejected');
    expect(consumer.disconnect).toHaveBeenCalled();
  });

  test('expired event rejects the wait', async () => {
    const promise = start();
    callbacks.received({ type: 'expired', reason: 'timeout' });
    await expect(promise).rejects.toThrow('No opponent');
    expect(consumer.disconnect).toHaveBeenCalled();
  });

  test('local timeout asks the server and follows an expired state', async () => {
    const promise = start(30000);
    jest.advanceTimersByTime(30000);
    await expect(promise).rejects.toThrow('No opponent');
    expect(checkSession).toHaveBeenCalledTimes(1);
  });

  test('local timeout enters when the server says matched', async () => {
    checkSession.mockResolvedValue({ matched: true, session_id: 's1' });
    const promise = start(1000);
    jest.advanceTimersByTime(1000);
    await expect(promise).resolves.toMatchObject({ matched: true, session_id: 's1' });
  });

  test('still waiting keeps waiting for the server event', async () => {
    checkSession.mockResolvedValue({ status: 'waiting' });
    const promise = start(1000);
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(consumer.disconnect).not.toHaveBeenCalled();
    callbacks.received({ type: 'matched', session_id: 's2' });
    await expect(promise).resolves.toMatchObject({ session_id: 's2' });
  });

  test('cancels pending subscriptions', async () => {
    const promise = start();
    controller.abort();
    await expect(promise).rejects.toThrow('cancelled');
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});

describe('server-derived timing', () => {
  test('timeout = expires_at − server_time even with a skewed client clock', () => {
    const now = 1_000_000_000_000;
    // Client clock is 5 minutes behind the server.
    const data = { server_time: new Date(now + 300000).toISOString(), expires_at: new Date(now + 330000).toISOString() };
    expect(clockOffset(data.server_time, now)).toBe(300000);
    expect(getWaitMs(data, now)).toBe(30000 + TIMEOUT_GRACE_MS);
    expect(toClientMs(data.expires_at, 300000)).toBe(now + 30000);
  });
  test('falls back to matchmaking_timeout_seconds, else no local timer', () => {
    expect(getWaitMs({ matchmaking_timeout_seconds: 30 }, 0)).toBe(30000 + TIMEOUT_GRACE_MS);
    expect(getWaitMs({}, 0)).toBeNull();
  });
});
