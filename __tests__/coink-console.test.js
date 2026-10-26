import { parseUnits, ZeroAddress } from 'ethers';
import { buildWithdrawal, contractInterface, FUNCTIONS, hasRole, parseArgument } from '../app/coink-console/contract';
import { submitTransaction } from '../app/coink-console/transactions';
import { COINK_ADDRESS, COINK_DECIMALS } from '../app/utils/web3Config';

const account = '0x1111111111111111111111111111111111111111';
const other = '0x2222222222222222222222222222222222222222';
const units = (value) => parseUnits(value, COINK_DECIMALS);

describe('COINK calldata', () => {
  test('encodes every supplied write function', () => {
    expect(FUNCTIONS).toHaveLength(14);
    FUNCTIONS.forEach((fn) => {
      const args = fn.inputs.map(([, type]) => parseArgument(type, type === 'address' ? account : '1'));
      expect(contractInterface.parseTransaction({ data: contractInterface.encodeFunctionData(fn.name, args) }).name).toBe(fn.name);
    });
  });

  test.each(['', '0', '-1', '1,5', '1 000', '1e3'])('rejects ambiguous/invalid amount %s', (value) => {
    expect(() => parseArgument('token', value)).toThrow();
  });

  test('preserves token precision and rejects excess precision and zero recipients', () => {
    expect(parseArgument('token', '1.000000000000000001')).toBe(units('1.000000000000000001'));
    expect(() => parseArgument('token', '0.0000000000000000001')).toThrow();
    expect(() => parseArgument('address', ZeroAddress)).toThrow();
  });

  test('encodes a reserve withdrawal with exact base units', () => {
    const data = buildWithdrawal([{ id: 3, amount: units('5') }], 0n, '3', other, '1.5');
    const decoded = contractInterface.parseTransaction({ data });
    expect(decoded.name).toBe('transferFromReserve');
    expect([...decoded.args]).toEqual([3n, other, units('1.5')]);
  });

  test('fund withdrawals ignore recipients and enforce available rather than total funds', () => {
    const reserves = [{ id: 7, amount: units('100') }];
    const decoded = contractInterface.parseTransaction({ data: buildWithdrawal(reserves, units('2'), '7', 'invalid', '2') });
    expect(decoded.name).toBe('withdrawReserveFund');
    expect([...decoded.args]).toEqual([units('2')]);
    expect(() => buildWithdrawal(reserves, units('2'), '7', other, '3')).toThrow('Maximum');
  });

  test.each([0, 1, 2, 12])('rejects restricted/unknown reserve %s', (id) => {
    expect(() => buildWithdrawal([{ id, amount: units('10') }], 0n, String(id), other, '1')).toThrow();
  });

  test('roles match actual callers, not individual Safe signers', () => {
    expect(hasRole(null, {}, 'public')).toBe(false);
    expect(hasRole(account, { ubq: other }, 'ubq')).toBe(false);
    expect(hasRole(account.toUpperCase(), { ubq: account }, 'ubq')).toBe(true);
  });
});

describe('COINK transaction safety', () => {
  let options;
  let signer;
  beforeEach(() => {
    signer = { getAddress: jest.fn().mockResolvedValue(account), sendTransaction: jest.fn().mockResolvedValue({ hash: '0x123' }) };
    options = {
      account, role: 'ubq', data: '0x1234',
      reader: { call: jest.fn().mockResolvedValue('0x') },
      contract: { owner: jest.fn().mockResolvedValue(other), UBQaddress: jest.fn().mockResolvedValue(account), AirDropManager: jest.fn().mockResolvedValue(other) },
      provider: { send: jest.fn().mockResolvedValue('0x89'), getSigner: jest.fn().mockResolvedValue(signer) },
    };
  });

  test('simulates from the effective caller before direct sending', async () => {
    await submitTransaction(options);
    expect(options.reader.call).toHaveBeenCalledWith({ from: account, to: COINK_ADDRESS, value: '0', data: '0x1234' });
    expect(options.reader.call.mock.invocationCallOrder[0]).toBeLessThan(signer.sendTransaction.mock.invocationCallOrder[0]);
  });

  test('rejects wrong networks including Polygon Amoy', async () => {
    options.provider.send.mockResolvedValue('0x13882');
    await expect(submitTransaction(options)).rejects.toThrow('Polygon Mainnet');
    expect(signer.sendTransaction).not.toHaveBeenCalled();
  });

  test('rejects changed browser accounts and live roles', async () => {
    signer.getAddress.mockResolvedValue(other);
    await expect(submitTransaction(options)).rejects.toThrow('account changed');
    signer.getAddress.mockResolvedValue(account);
    options.contract.UBQaddress.mockResolvedValue(other);
    await expect(submitTransaction(options)).rejects.toThrow('required contract role');
    expect(signer.sendTransaction).not.toHaveBeenCalled();
  });

  test('never submits a failed simulation', async () => {
    options.reader.call.mockRejectedValue(new Error('reverted'));
    await expect(submitTransaction(options)).rejects.toThrow('reverted');
    expect(signer.sendTransaction).not.toHaveBeenCalled();
  });

  test('Safe proposals simulate as the Safe and never invoke browser signing', async () => {
    options.safe = { sdk: {
      safe: { getSafeInfo: jest.fn().mockResolvedValue({ safeAddress: account, chainId: 137 }) },
      txs: { send: jest.fn().mockResolvedValue({ safeTxHash: 'safe-hash' }) },
    } };
    await expect(submitTransaction(options)).resolves.toEqual({ safeTxHash: 'safe-hash' });
    expect(options.safe.sdk.txs.send).toHaveBeenCalledWith({ txs: [{ to: COINK_ADDRESS, value: '0', data: '0x1234' }] });
    expect(options.provider.getSigner).not.toHaveBeenCalled();
    options.safe.sdk.safe.getSafeInfo.mockResolvedValue({ safeAddress: account, chainId: 1 });
    await expect(submitTransaction(options)).rejects.toThrow('Safe account/network changed');
    expect(options.safe.sdk.txs.send).toHaveBeenCalledTimes(1);
  });
});
