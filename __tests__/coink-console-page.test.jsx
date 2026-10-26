import { render, screen, waitFor } from '@testing-library/react';
import CoinkConsolePageClient from '../app/coink-console/CoinkConsolePageClient';

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

beforeEach(() => { localStorage.clear(); mockParams.delete('coink'); });

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
