import { getAddress } from 'ethers';
import { COINK_ADDRESS, POLYGON_CHAIN_ID } from '../utils/web3Config';
import { hasRole, sameAddress } from './contract';

// Revalidate identity, network and current on-chain authority at submission time.
export async function submitTransaction({ reader, contract, safe, provider, account, role, data }) {
  let signer;
  if (safe) {
    const info = await safe.sdk.safe.getSafeInfo();
    if (Number(info.chainId) !== POLYGON_CHAIN_ID || !sameAddress(info.safeAddress, account)) {
      throw new Error('Safe account/network changed. Reopen the Polygon Safe App.');
    }
  } else {
    if (!provider) throw new Error('Connect an authorized wallet first.');
    // Query the underlying wallet rather than relying on cached React state.
    const chain = await provider.send('eth_chainId', []);
    if (Number(chain) !== POLYGON_CHAIN_ID) throw new Error('Switch to Polygon Mainnet (137).');
    signer = await provider.getSigner();
    if (!sameAddress(await signer.getAddress(), account)) throw new Error('Wallet account changed. Please retry.');
  }
  const [owner, ubq, airdrop] = await Promise.all([contract.owner(), contract.UBQaddress(), contract.AirDropManager()]);
  if (!hasRole(account, { owner, ubq, airdrop }, role)) throw new Error('This account does not have the required contract role.');
  const transaction = { to: getAddress(COINK_ADDRESS), value: '0', data };
  await reader.call({ ...transaction, from: account });
  if (safe) {
    const result = await safe.sdk.txs.send({ txs: [transaction] });
    return { safeTxHash: result.safeTxHash };
  }
  const tx = await signer.sendTransaction(transaction);
  return { tx };
}
