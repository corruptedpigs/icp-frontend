import { render, waitFor, act } from '@testing-library/react';
import { WalletProvider, useWallet } from '../app/context/WalletContext';
import { setSimulation } from '../app/utils/simulation';

jest.mock('ethers', () => ({ BrowserProvider: jest.fn(), Contract: jest.fn(), formatUnits: jest.fn() }));

const ADDR = '0x' + 'b'.repeat(40);
let ctx;
const Probe = () => { ctx = useWallet(); return <div data-testid="acc">{ctx.account}</div>; };
const mount = () => render(<WalletProvider><Probe /></WalletProvider>);

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  delete window.ethereum;
  setSimulation(true);
});
afterEach(() => setSimulation(false));

test('connects a typed address without window.ethereum and persists it', async () => {
  const { getByTestId } = mount();
  let ok;
  await act(async () => { ok = await ctx.connectWallet(ADDR); });
  expect(ok).toBe(true);
  expect(getByTestId('acc')).toHaveTextContent(ADDR);
  expect(ctx.provider).toBeNull();
  expect(ctx.isPolygonNetwork()).toBe(true);
  expect(localStorage.getItem('sim-wallet')).toBe(ADDR);
});

test('rejects invalid addresses and ignores click events', async () => {
  mount();
  await act(async () => { expect(await ctx.connectWallet('nope')).toBe(false); });
  window.prompt = jest.fn(() => '');
  await act(async () => { expect(await ctx.connectWallet({ type: 'click' })).toBe(false); });
  expect(ctx.account).toBeNull();
});

test('restores the saved address on mount and clears it on disconnect', async () => {
  localStorage.setItem('sim-wallet', ADDR);
  const { getByTestId } = mount();
  await waitFor(() => expect(getByTestId('acc')).toHaveTextContent(ADDR));
  await act(async () => { await ctx.disconnectWallet(); });
  expect(ctx.account).toBeNull();
  expect(localStorage.getItem('sim-wallet')).toBeNull();
});

test('switching mode drops the simulated account', async () => {
  const { getByTestId } = mount();
  await act(async () => { await ctx.connectWallet(ADDR); });
  expect(getByTestId('acc')).toHaveTextContent(ADDR);
  act(() => setSimulation(false));
  await waitFor(() => expect(ctx.account).toBeNull());
  expect(ctx.provider).toBeNull();
});
