import { render, screen, waitFor, act } from '@testing-library/react';
import CoinkConsolePageClient, { READ_RETRY_MS } from '../app/coink-console/CoinkConsolePageClient';

const mockParams = new URLSearchParams();
const mockWallet = { account: null, chainId: null };
jest.mock('next/navigation', () => ({ useSearchParams: () => mockParams }));
jest.mock('../app/context/WalletContext', () => ({ useWallet: () => mockWallet }));
jest.mock('../ui/components/homepage/navbar_with_connect_wallet', () => function Navbar() { return <nav>Navbar</nav>; });
jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return { ...actual, JsonRpcProvider: jest.fn(() => ({ destroy: jest.fn() })), Contract: jest.fn(() => ({
    owner: async () => '0x1111111111111111111111111111111111111111',
    UBQaddress: async () => '0x2222222222222222222222222222222222222222',
    AirDropManager: async () => '0x3333333333333333333333333333333333333333',
    reserves: async () => ({ name: 'Reserve', amount: 10n ** 18n }),
    ...Object.fromEntries(['excessBalance', 'COINKbalance', 'POLbalance', 'totalReserved', 'totalFoundersLocked', 'totalSocialWhitelisted', 'reserveFundAvailable'].map((name) => [name, async () => 0n])),
  })) };
});

beforeEach(() => { localStorage.clear(); mockParams.delete('coink'); jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

test('locked UI does not initialize console RPCs', async () => {
  const { JsonRpcProvider } = require('ethers');
  JsonRpcProvider.mockClear();
  render(<CoinkConsolePageClient />);
  expect(await screen.findByText('Access restricted')).toBeInTheDocument();
  expect(JsonRpcProvider).not.toHaveBeenCalled();
});

test('unlock persists, permits read-only access, but never enables unauthorized sending', async () => {
  mockParams.set('coink', 'berardo');
  render(<CoinkConsolePageClient />);
  expect(await screen.findByText('Connection')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Calldata only' })).toBeEnabled());
  expect(localStorage.getItem('coink_unlocked')).toBe('1');
  expect(screen.getByRole('button', { name: 'Send withdrawal' })).toBeDisabled();
});

test('lock URL revokes persisted console access', async () => {
  localStorage.setItem('coink_unlocked', '1');
  mockParams.set('coink', 'locked');
  render(<CoinkConsolePageClient />);
  expect(await screen.findByText('Access restricted')).toBeInTheDocument();
  expect(localStorage.getItem('coink_unlocked')).toBeNull();
});

describe('failed read auto-retry', () => {
  function mockContract({ failUntil = 0 } = {}) {
    const { Contract } = require('ethers');
    const calls = { owner: 0, reserves: 0 };
    Contract.mockImplementationOnce(() => ({
      owner: async () => { calls.owner += 1; if (calls.owner <= failUntil) throw new Error('server response 401'); return '0x1111111111111111111111111111111111111111'; },
      UBQaddress: async () => '0x2222222222222222222222222222222222222222',
      AirDropManager: async () => '0x3333333333333333333333333333333333333333',
      reserves: async () => { calls.reserves += 1; if (calls.owner <= failUntil) throw new Error('server response 401'); return { name: 'Reserve', amount: 10n ** 18n }; },
      ...Object.fromEntries(['excessBalance', 'COINKbalance', 'POLbalance', 'totalReserved', 'totalFoundersLocked', 'totalSocialWhitelisted', 'reserveFundAvailable'].map((name) => [name, async () => 0n])),
    }));
    return calls;
  }

  test('retries a failed read after 30 s and stops once a refresh succeeds', async () => {
    const calls = mockContract({ failUntil: 1 });
    mockParams.set('coink', 'berardo');
    render(<CoinkConsolePageClient />);
    await act(async () => {}); // flush the initial refresh (fails)
    expect(screen.getByText(/Could not read contract: server response 401/)).toBeInTheDocument();
    expect(calls.owner).toBe(1);
    await act(async () => { jest.advanceTimersByTime(READ_RETRY_MS - 1); });
    expect(calls.owner).toBe(1); // no premature retry
    await act(async () => { jest.advanceTimersByTime(1); });
    await act(async () => {}); // flush the retry refresh (succeeds)
    expect(calls.owner).toBe(2); // retried exactly once
    expect(screen.queryByText(/Could not read contract/)).not.toBeInTheDocument();
    await act(async () => { jest.advanceTimersByTime(60_000); });
    expect(calls.owner).toBe(2); // success stops the retry timer
  });

  test('keeps retrying while reads keep failing', async () => {
    const calls = mockContract({ failUntil: 99 });
    mockParams.set('coink', 'berardo');
    render(<CoinkConsolePageClient />);
    await act(async () => {});
    expect(screen.getByText(/Could not read contract: server response 401/)).toBeInTheDocument();
    for (let i = 2; i <= 4; i += 1) {
      await act(async () => { jest.advanceTimersByTime(READ_RETRY_MS); });
      await act(async () => {});
      expect(calls.owner).toBe(i);
      expect(screen.getByText(/Could not read contract/)).toBeInTheDocument();
    }
  });
});

test('embedded in an iframe (Safe{Wallet}) unlocks without the flag', async () => {
  const original = Object.getOwnPropertyDescriptor(window, 'parent');
  Object.defineProperty(window, 'parent', { value: {}, configurable: true });
  try {
    render(<CoinkConsolePageClient />);
    expect(await screen.findByText('Connection')).toBeInTheDocument();
    expect(screen.queryByText('Access restricted')).not.toBeInTheDocument();
    expect(localStorage.getItem('coink_unlocked')).toBeNull();
  } finally {
    if (original) Object.defineProperty(window, 'parent', original); else delete window.parent;
  }
});
