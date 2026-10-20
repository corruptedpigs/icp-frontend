import { createConsumer } from '@rails/actioncable';
import { getCableUrl, waitForCableMatch } from '../app/utils/matchmaking';

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
  const start = () => waitForCableMatch({
    apiUrl: 'http://localhost:3000', token: 'queue-token', signal: controller.signal,
    timeoutMessage: 'Timed out', failureMessage: 'Rejected',
  });
  beforeEach(() => {
    jest.useFakeTimers();
    controller = new AbortController();
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

  test('times out when no match arrives', async () => {
    const promise = start();
    jest.advanceTimersByTime(90000);
    await expect(promise).rejects.toThrow('Timed out');
    expect(consumer.disconnect).toHaveBeenCalled();
  });

  test('cancels pending subscriptions', async () => {
    const promise = start();
    controller.abort();
    await expect(promise).rejects.toThrow('cancelled');
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});
