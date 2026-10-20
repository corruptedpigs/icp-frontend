import { render, waitFor } from '@testing-library/react';
import { WalletProvider, useWallet } from '../app/context/WalletContext';
import { useEffect } from 'react';

jest.mock('ethers', () => {
  const MockSigner = {
    getAddress: jest.fn().mockResolvedValue('0xTestAddress'),
  };
  const MockBrowserProvider = function () {};
  MockBrowserProvider.prototype.getNetwork = jest.fn().mockResolvedValue({ chainId: BigInt(137) });
  MockBrowserProvider.prototype.getSigner = jest.fn().mockReturnValue(MockSigner);
  return {
    BrowserProvider: MockBrowserProvider,
    formatUnits: jest.fn(() => '1.0'),
  };
});

const ConnectOnMount = () => {
  const { connectWallet, account } = useWallet();
  useEffect(() => {
    connectWallet();
  }, [connectWallet]);
  return <div data-testid="acc">{account}</div>;
};

describe('WalletProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'ethereum', { configurable: true, value: {
      request: jest.fn().mockResolvedValue(['0xTestAccount']),
      on: jest.fn(),
      removeListener: jest.fn(),
    } });
  });

  test('connectWallet stores flag and sets account', async () => {
    const { getByTestId } = render(
      <WalletProvider>
        <ConnectOnMount />
      </WalletProvider>
    );
    await waitFor(() => expect(getByTestId('acc')).toHaveTextContent('0xTestAccount'));
    expect(localStorage.getItem('wallet-connected')).toBe('true');
  });
});
