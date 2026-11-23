import { renderHook, waitFor, act } from '@testing-library/react';

process.env.NEXT_PUBLIC_TRACKED_NFT_ADDRESS = '0xc03B2ed81Cfce282D5cd921D429262f7cca3651f';
process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test-key';
process.env.NEXT_PUBLIC_GAME_API_URL = 'http://api.test';

const ACCOUNT = '0x' + 'a'.repeat(40);
let mockWallet;
jest.mock('../app/context/WalletContext', () => ({ useWallet: () => mockWallet }));
jest.mock('../app/components/LanguageContext', () => ({ useTranslations: () => ({ t: k => k }) }));
jest.mock('../app/utils/matchmaking', () => ({ waitForCableMatch: jest.fn() }));

const { useWalletNFTs } = require('../app/hooks/useWalletNFTs');
const { useJoinGame } = require('../app/hooks/useJoinGame');
const { setSimulation, isSimulation, getSimulationError } = require('../app/utils/simulation');
const { fetchGameApi, withSimulationParam } = require('../app/utils/gameApi');

const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });
const urls = () => global.fetch.mock.calls.map(c => String(c[0]));

beforeEach(() => {
  localStorage.clear();
  mockWallet = { account: ACCOUNT, provider: null, chainId: 137 };
  global.fetch = jest.fn();
});
afterEach(() => setSimulation(false));

describe('simulation mode on', () => {
  beforeEach(() => setSimulation(true));

  test('useWalletNFTs loads cards from the backend only', async () => {
    delete process.env.NEXT_PUBLIC_ALCHEMY_API_KEY; // guard must be ignored; restored below
    global.fetch.mockResolvedValue(json({ wallet: ACCOUNT, collection: 'x', cards: [
      { id: 7, token_id: '11', name: 'Pig', image: 'ipfs://abc', burn_power: 12, status: 'active' },
      { id: 8, token_id: '12', name: 'NoImg', image: null, burn_power: 1, status: 'active' },
    ] }));
    const { result } = renderHook(() => useWalletNFTs());
    await waitFor(() => expect(result.current.nfts).toHaveLength(1));
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test-key';
    expect(result.current.nfts[0]).toEqual({
      id: '7', tokenId: '11', name: 'Pig', burnPower: 12,
      image: 'https://ipfs.corruptedpigs.com/ipfs/abc',
    });
    expect(result.current.nftImages).toEqual(['https://ipfs.corruptedpigs.com/ipfs/abc']);
    expect(urls()).toEqual([`http://api.test/api/v1/players/${ACCOUNT}/cards`]);
    expect(urls().some(u => u.includes('alchemy'))).toBe(false);
    expect(global.fetch.mock.calls[0][1].headers['X-Simulation']).toBe('on');
  });

  test.each([403, 404])('a %i from the backend turns test mode off with a clear error', async (status) => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValue(json({}, status));
    const { result } = renderHook(() => useWalletNFTs());
    await waitFor(() => expect(isSimulation()).toBe(false));
    expect(getSimulationError()).toMatch(/not available/);
    expect(urls()[0]).toBe(`http://api.test/api/v1/players/${ACCOUNT}/cards`);
    expect(result.current.nfts).toEqual([]);
  });

  test('every request carries X-Simulation and the cable URL gets ?simulation=on', async () => {
    global.fetch.mockResolvedValue(json({}));
    await fetchGameApi('/api/v1/anything', { headers: { Authorization: 'Bearer x' } });
    expect(global.fetch.mock.calls[0][1].headers).toEqual({ Authorization: 'Bearer x', 'X-Simulation': 'on' });
    expect(withSimulationParam('ws://api.test/cable')).toBe('ws://api.test/cable?simulation=on');
  });

  test('tokens are kept per mode', async () => {
    global.fetch
      .mockResolvedValueOnce(json({ token: 'sim-token' }))
      .mockResolvedValueOnce(json({ matched: true, session_id: 's1' }));
    const { result } = renderHook(() => useJoinGame());
    await act(async () => { await result.current.joinGame(); });
    expect(result.current.token).toBe('sim-token');
    act(() => setSimulation(false));
    expect(result.current.token).toBeNull();
  });

  test('useJoinGame uses /auth/simulate without nonce or signing', async () => {
    global.fetch
      .mockResolvedValueOnce(json({ token: 'sim-token' }))
      .mockResolvedValueOnce(json({ matched: true, session_id: 's1' }));
    const { result } = renderHook(() => useJoinGame());
    let out;
    await act(async () => { out = await result.current.joinGame(); });
    expect(out).toMatchObject({ token: 'sim-token', matched: true });
    expect(urls()).toEqual(['http://api.test/api/v1/auth/simulate', 'http://api.test/api/v1/matchmaking']);
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual({ wallet: ACCOUNT });
    expect(global.fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer sim-token');
  });
});

describe('simulation mode off (regression)', () => {
  test('no X-Simulation header and no cable param', async () => {
    global.fetch.mockResolvedValue(json({}));
    await fetchGameApi('/api/v1/anything');
    expect(global.fetch.mock.calls[0][1]).toBeUndefined();
    expect(withSimulationParam('ws://api.test/cable')).toBe('ws://api.test/cable');
  });

  test('useWalletNFTs still calls Alchemy, not the game backend', async () => {
    global.fetch.mockResolvedValue(json({ ownedNfts: [
      { tokenId: '1', name: 'Pig', raw: { metadata: { image: 'https://img/1.png' } }, rawMetadata: { attributes: [{ trait_type: 'Burn Power', value: '5' }] } },
    ] }));
    const { result } = renderHook(() => useWalletNFTs());
    await waitFor(() => expect(result.current.nfts).toHaveLength(1));
    expect(result.current.nfts[0]).toEqual({ image: 'https://img/1.png', burnPower: 5, name: 'Pig' });
    expect(urls()).toHaveLength(1);
    expect(urls()[0]).toContain('alchemy.com/nft/v3/test-key/getNFTsForOwner');
  });

  test('useJoinGame requires a provider and never calls /auth/simulate', async () => {
    mockWallet = { account: ACCOUNT, provider: null, chainId: 137 };
    const { result } = renderHook(() => useJoinGame());
    await expect(result.current.joinGame()).rejects.toThrow('game.errors.walletNotConnected');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
