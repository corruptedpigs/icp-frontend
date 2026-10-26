import { Interface, formatUnits, getAddress, parseUnits, ZeroAddress } from 'ethers';
import { COINK_DECIMALS } from '../utils/web3Config';

export const FUNCTIONS = [
  { name: 'withdrawReserveFund', role: 'ubq', description: 'Withdraw Reserve Fund to UBQ after 48 months.', inputs: [['amount', 'token']] },
  { name: 'transferFromReserve', role: 'ubq', description: 'Transfer from reserves other than Founders, Social, Airdrops and Reserve Fund.', inputs: [['reserveId', 'uint'], ['to', 'address'], ['amount', 'token']] },
  { name: 'burnCoink', role: 'ubq', danger: true, description: 'Permanently burn reserve tokens (except Founders and Social).', inputs: [['reserveId', 'uint'], ['amount', 'token']] },
  { name: 'addSocialWhitelist', role: 'ubq', description: 'Allocate Social reserve tokens; claims unlock after 12 months.', inputs: [['account', 'address'], ['amount', 'token']] },
  { name: 'withdrawExcess', role: 'ubq', description: 'Recover excess COINK to UBQ.', inputs: [] },
  { name: 'releaseERC20Tokens', role: 'ubq', description: 'Recover another ERC-20 token held by the contract.', inputs: [['_tokenId', 'address']] },
  { name: 'releasePOL', role: 'ubq', description: 'Recover native POL held by the contract.', inputs: [] },
  { name: 'setNewAirDropManager', role: 'ubq', danger: true, description: 'Change the account authorized to send airdrops.', inputs: [['newAddress', 'address']] },
  { name: 'setNewUBQwallet', role: 'owner', danger: true, description: 'Replace UBQ. The current treasury loses access.', inputs: [['newUBQaddress', 'address']] },
  { name: 'distributeToFounders', role: 'owner', description: 'Distribute the Founders reserve once.', inputs: [] },
  { name: 'renounceOwnership', role: 'owner', danger: true, description: 'Permanently renounce ownership. Only after distributing to founders.', inputs: [] },
  { name: 'sendAirDrop', role: 'airdrop', description: 'Send Community Airdrops (less than 500,000 tokens per call).', inputs: [['account', 'address'], ['amount', 'token']] },
  { name: 'claimFounderVested', role: 'public', description: 'Claim monthly founder vesting, starting at month 24.', inputs: [] },
  { name: 'claimSocialWhitelist', role: 'public', description: 'Claim a Social allocation, starting at month 12.', inputs: [] },
];

export const READS = [
  ['excessBalance', 'Excess COINK'], ['COINKbalance', 'COINK in contract'],
  ['POLbalance', 'POL in contract'], ['totalReserved', 'Total reserved'],
  ['totalFoundersLocked', 'Founders locked'], ['totalSocialWhitelisted', 'Social allocated'],
  ['reserveFundAvailable', 'Reserve Fund available'],
];

export const ABI = [
  'function owner() view returns (address)',
  'function UBQaddress() view returns (address)',
  'function AirDropManager() view returns (address)',
  'function reserves(uint256) view returns (string name, uint256 amount)',
  ...READS.map(([name]) => `function ${name}() view returns (uint256)`),
  ...FUNCTIONS.map(({ name, inputs }) => `function ${name}(${inputs.map(([key, type]) => `${type === 'address' ? 'address' : 'uint256'} ${key}`).join(',')})`),
];
export const contractInterface = new Interface(ABI);
export const FUND = 7;
export const TRANSFERABLE = [3, 4, 5, 6, 8, 9, 10, 11];
export const ROLE_LABELS = { ubq: 'UBQ treasury', owner: 'Owner', airdrop: 'Airdrop manager', public: 'Public' };
export const sameAddress = (a, b) => Boolean(a && b && a.toLowerCase() === b.toLowerCase());
export const hasRole = (account, roles, role) => Boolean(account && (role === 'public' || sameAddress(account, roles[role])));
export const formatAmount = (value, decimals = COINK_DECIMALS) => formatUnits(value, decimals);

export function parseArgument(type, input) {
  const value = String(input || '').trim();
  if (type === 'address') {
    const address = getAddress(value);
    if (address === ZeroAddress) throw new Error('The zero address is not allowed.');
    return address;
  }
  if (type === 'token') {
    if (!/^\d+(\.\d+)?$/.test(value)) throw new Error('Use a positive amount with a decimal point (no commas).');
    const amount = parseUnits(value, COINK_DECIMALS);
    if (amount <= 0n) throw new Error('Amount must be greater than zero.');
    return amount;
  }
  if (!/^\d+$/.test(value)) throw new Error('Enter a non-negative whole number.');
  return BigInt(value);
}

export function buildWithdrawal(reserves, fundAvailable, reserveId, recipient, input) {
  const reserve = reserves.find(({ id }) => String(id) === String(reserveId));
  if (!reserve || !(reserve.id === FUND || TRANSFERABLE.includes(reserve.id))) throw new Error('Select a withdrawable reserve.');
  const amount = parseArgument('token', input);
  const cap = reserve.id === FUND ? fundAvailable : reserve.amount;
  if (amount > cap) throw new Error(`Maximum available: ${formatAmount(cap)}.`);
  return reserve.id === FUND
    ? contractInterface.encodeFunctionData('withdrawReserveFund', [amount])
    : contractInterface.encodeFunctionData('transferFromReserve', [reserve.id, parseArgument('address', recipient), amount]);
}
