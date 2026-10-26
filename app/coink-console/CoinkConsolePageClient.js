"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Contract, JsonRpcProvider } from 'ethers';
import NavbarWithConnectWallet from '../../ui/components/homepage/navbar_with_connect_wallet';
import { useWallet } from '../context/WalletContext';
import { checkAndPersistFlag } from '../utils/featureFlags';
import { COINK_ADDRESS, COINK_SYMBOL, POLYGON_CHAIN_ID, POLYGON_EXPLORER_URL, POLYGON_RPC_URL } from '../utils/web3Config';
import { ABI, FUNCTIONS, READS, FUND, TRANSFERABLE, ROLE_LABELS, buildWithdrawal, contractInterface, formatAmount, hasRole, parseArgument, sameAddress } from './contract';
import { submitTransaction } from './transactions';

const button = 'btn btn-sm btn-outline border-pink-500/50 text-pink-300 hover:bg-pink-500 hover:border-pink-500';
const input = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground disabled:opacity-50';
const errorText = (error) => error.reason || error.shortMessage || error.message || 'Operation failed.';

export default function CoinkConsolePageClient() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(null);
  useEffect(() => { setUnlocked(checkAndPersistFlag('coink', searchParams)); }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarWithConnectWallet show_logo />
      <main className="relative mx-auto max-w-5xl px-4 pb-16 pt-28">
        <h1 className="font-display text-5xl tracking-wider text-glow-pink">COINK CONSOLE</h1>
        <p className="mb-6 mt-2 text-muted-foreground">Team treasury operations · Polygon Mainnet</p>
        {unlocked === null ? <p role="status">Loading…</p> : !unlocked ? (
          <section className="glass-card p-6">
            <h2 className="mb-3 text-xl">Access restricted</h2>
            <p className="text-muted-foreground">This console is in team testing. Ask an administrator for the access link.</p>
          </section>
        ) : <Console />}
      </main>
    </div>
  );
}

function Console() {
  const wallet = useWallet();
  const [connection, setConnection] = useState({ checking: true, safe: null, embedded: false, error: '' });
  const [resources, setResources] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [readError, setReadError] = useState('');
  const [tab, setTab] = useState('withdraw');
  const [reserveId, setReserveId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [output, setOutput] = useState(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const safe = connection.safe;
  const account = safe?.info.safeAddress || (connection.embedded ? null : wallet.account);
  const chainId = safe ? Number(safe.info.chainId) : wallet.chainId;
  const roles = snapshot?.roles || {};

  useEffect(() => {
    const reader = new JsonRpcProvider(POLYGON_RPC_URL, POLYGON_CHAIN_ID);
    setResources({ reader, contract: new Contract(COINK_ADDRESS, ABI, reader) });
    return () => reader.destroy();
  }, []);

  useEffect(() => {
    let active = true;
    let timer;
    let sdk;
    const embedded = window.parent !== window;
    if (!embedded) {
      setConnection({ checking: false, safe: null, embedded: false, error: '' });
      return;
    }
    (async () => {
      try {
        const { default: SafeAppsSDK } = await import('@safe-global/safe-apps-sdk');
        if (!active) return;
        sdk = new SafeAppsSDK({ allowedDomains: [/^https:\/\/app\.safe\.global$/] });
        const info = await Promise.race([
          sdk.safe.getSafeInfo(),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Safe connection timed out. Open this page as a custom app at app.safe.global.')), 5000); }),
        ]);
        if (active) setConnection({ checking: false, safe: { sdk, info }, embedded: true, error: '' });
      } catch (error) {
        if (active) setConnection({ checking: false, safe: null, embedded: true, error: errorText(error) });
      } finally { clearTimeout(timer); }
    })();
    return () => {
      active = false;
      clearTimeout(timer);
      // SDK v9 has no public destroy method; remove its message listener on unmount.
      if (sdk?.communicator?.onParentMessage) window.removeEventListener('message', sdk.communicator.onParentMessage);
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!resources) return;
    setLoading(true);
    setReadError('');
    try {
      const { contract } = resources;
      const [owner, ubq, airdrop, reserves, values] = await Promise.all([
        contract.owner(), contract.UBQaddress(), contract.AirDropManager(),
        Promise.all(Array.from({ length: 12 }, (_, id) => contract.reserves(id).then((reserve) => ({ id, name: reserve.name, amount: reserve.amount })))),
        Promise.all(READS.map(async ([name]) => [name, await contract[name]()])),
      ]);
      setSnapshot({ roles: { owner, ubq, airdrop }, reserves, values: Object.fromEntries(values) });
    } catch (error) {
      setSnapshot(null); // Never allow sends based on stale permissions/balances after a failed refresh.
      setReadError(errorText(error));
    } finally { setLoading(false); }
  }, [resources]);
  useEffect(() => { refresh(); }, [refresh]);

  const fundAvailable = snapshot?.values.reserveFundAvailable || 0n;
  const withdrawable = (snapshot?.reserves || []).filter((reserve) => reserve.id === FUND ? fundAvailable > 0n : TRANSFERABLE.includes(reserve.id) && reserve.amount > 0n);
  const selectedId = withdrawable.some(({ id }) => String(id) === reserveId) ? reserveId : String(withdrawable[0]?.id ?? '');
  const selected = withdrawable.find(({ id }) => String(id) === selectedId);
  const canSend = (role) => !connection.checking && !connection.error && !loading && Boolean(snapshot) && chainId === POLYGON_CHAIN_ID && hasRole(account, roles, role);

  async function run(name, role, buildData, onlyData, danger = false) {
    if (sending.current) return;
    try {
      const data = buildData();
      if (onlyData) {
        setOutput({ text: `Safe → New transaction → Transaction Builder → Custom data\nNetwork: Polygon (137)\nTo: ${COINK_ADDRESS}\nValue: 0\nData: ${data}\n\nCalldata only: not simulated or submitted. Verify all details in Safe before signing.` });
        return;
      }
      if (!canSend(role)) throw new Error('Connect an authorized wallet or Polygon Safe first.');
      const decoded = contractInterface.parseTransaction({ data });
      const definition = FUNCTIONS.find((fn) => fn.name === decoded.name);
      const details = definition.inputs.map(([key, type], index) => `${key}: ${type === 'token' ? `${formatAmount(decoded.args[index])} ${COINK_SYMBOL}` : decoded.args[index].toString()}`).join('\n');
      if (!window.confirm(`${danger ? 'DANGER — potentially irreversible operation.\n' : ''}${name}\n${decoded.name}\n${details}\nContract: ${COINK_ADDRESS}\nFrom: ${account}\nNetwork: Polygon (137)\nValue: 0\nCalldata: ${data}\n\nVerify these details before continuing.`)) return;
      sending.current = true;
      setBusy(true);
      setOutput({ text: 'Simulating transaction…' });
      const result = await submitTransaction({ ...resources, safe, provider: wallet.provider, account, role, data });
      if (result.safeTxHash) {
        setOutput({ text: `Proposed to Safe: ${result.safeTxHash}\nOther signers must confirm and execute in Safe. Funds have not moved yet.` });
      } else {
        setOutput({ text: `Submitted: ${result.tx.hash}\nWaiting for confirmation…`, hash: result.tx.hash });
        const receipt = await result.tx.wait();
        if (receipt.status !== 1) throw new Error('Transaction reverted.');
        setOutput({ text: `Confirmed: ${result.tx.hash}`, hash: result.tx.hash });
        await refresh();
      }
    } catch (error) { setOutput({ error: true, text: errorText(error) }); }
    finally { sending.current = false; setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <section className="glass-card p-5 space-y-4">
        <h2 className="text-xl">Connection</h2>
        <p className="text-sm text-muted-foreground">Internal testing UI, not authentication. Contract permissions and Safe signatures authorize operations. Safe signers must use the Safe App, not send from their individual wallets.</p>
        <a href={`${POLYGON_EXPLORER_URL}address/${COINK_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="block break-all font-mono text-sm text-pink-300">{COINK_SYMBOL}: {COINK_ADDRESS}</a>
        <p className="break-all text-xs text-muted-foreground">Read RPC: {POLYGON_RPC_URL}</p>
        <p role="status" className="break-all text-sm">{connection.checking ? 'Checking Safe connection…' : safe ? `Safe: ${account} · Chain ${chainId} · ${safe.info.threshold}/${safe.info.owners.length} signatures` : connection.error || (account ? `Browser wallet: ${account}` : 'Read-only. Connect a wallet or open as a custom Safe App. Calldata generation does not require a wallet.')}</p>
        {account && chainId !== POLYGON_CHAIN_ID && <p role="alert" className="text-amber-300">Wrong network. Use Polygon Mainnet (137), not Amoy.</p>}
        <div className="flex flex-wrap gap-3">
          {!connection.embedded && !account && <button className={button} disabled={wallet.isConnecting} onClick={async () => { if (!await wallet.connectWallet()) setOutput({ error: true, text: 'Could not connect. Check that a browser wallet is installed and approve the connection.' }); }}>Connect wallet</button>}
          {!connection.embedded && account && chainId !== POLYGON_CHAIN_ID && <button className={button} onClick={wallet.switchToPolygon}>Switch to Polygon</button>}
          <button className={button} disabled={loading || busy} onClick={refresh}>{loading ? 'Loading…' : 'Refresh on-chain data'}</button>
          <a className={button} href="https://app.safe.global" target="_blank" rel="noopener noreferrer">Open Safe</a>
        </div>
        {Object.entries(roles).map(([role, address]) => <p key={role} className="break-all text-xs"><span className={sameAddress(account, address) ? 'text-green-300' : 'text-muted-foreground'}>{ROLE_LABELS[role]}: </span><span className="font-mono">{address}</span>{sameAddress(account, address) ? ' (connected)' : ''}</p>)}
        {account && snapshot && !hasRole(account, roles, 'ubq') && <p className="text-sm text-amber-300">This account is not UBQ. Reserve withdrawals are disabled; you can prepare calldata for the treasury Safe.</p>}
        {readError && <p role="alert" className="text-red-300">Could not read contract: {readError}</p>}
      </section>

      <div className="flex gap-3" aria-label="Console sections">
        <button className={button} aria-pressed={tab === 'withdraw'} onClick={() => setTab('withdraw')}>Withdrawals</button>
        <button className={button} aria-pressed={tab === 'functions'} onClick={() => setTab('functions')}>All functions</button>
      </div>

      {tab === 'withdraw' ? <>
        <section className="glass-card p-5">
          <h2 className="mb-4 text-xl">Reserves</h2>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-2">#</th><th className="p-2">Reserve</th><th className="p-2">Balance ({COINK_SYMBOL})</th><th className="p-2">Withdrawal route</th></tr></thead>
            <tbody>{(snapshot?.reserves || []).map((reserve) => <tr key={reserve.id} className="border-b border-border/50"><td className="p-2">{reserve.id}</td><td className="p-2">{reserve.name}</td><td className="p-2 font-mono">{formatAmount(reserve.amount)}</td><td className="p-2 text-muted-foreground">{reserve.id === 0 ? 'Founders distribution (owner)' : reserve.id === 1 ? 'Social whitelist' : reserve.id === 2 ? 'Airdrop manager' : reserve.id === FUND ? fundAvailable > 0n ? 'Reserve Fund → UBQ' : 'Locked (48 months) or empty' : reserve.amount > 0n ? 'Transfer from reserve' : 'Empty'}</td></tr>)}</tbody>
          </table></div>
        </section>
        <section className="glass-card p-5 space-y-4">
          <h2 className="text-xl">Withdraw from a reserve</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">Reserve<select className={input} value={selectedId} onChange={(event) => setReserveId(event.target.value)}>{!withdrawable.length && <option value="">No withdrawable reserves</option>}{withdrawable.map((reserve) => <option key={reserve.id} value={reserve.id}>{reserve.id} · {reserve.name}</option>)}</select></label>
            <label className="space-y-2 text-sm">Recipient<input className={input} disabled={selectedId === String(FUND)} value={selectedId === String(FUND) ? roles.ubq || '' : recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="0x…" spellCheck={false} /></label>
            <label className="space-y-2 text-sm">Amount ({COINK_SYMBOL})<input className={input} value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="0.0" /></label>
            <button className={`${button} self-end`} disabled={!selected} onClick={() => setAmount(formatAmount(selected.id === FUND ? fundAvailable : selected.amount))}>Max</button>
          </div>
          {selectedId === String(FUND) && <p className="text-sm text-amber-300">Reserve Fund always pays UBQ. The recipient cannot be changed.</p>}
          <div className="flex flex-wrap gap-3">
            <button className={button} disabled={busy || !selected || !canSend('ubq')} onClick={() => run('Reserve withdrawal', 'ubq', () => buildWithdrawal(snapshot.reserves, fundAvailable, selectedId, recipient, amount), false)}>{safe ? 'Propose withdrawal' : 'Send withdrawal'}</button>
            <button className={button} disabled={busy || loading || !selected} onClick={() => run('Reserve withdrawal', 'ubq', () => buildWithdrawal(snapshot.reserves, fundAvailable, selectedId, recipient, amount), true)}>Calldata only</button>
          </div>
        </section>
      </> : <>
        <section className="glass-card p-5">
          <h2 className="mb-4 text-xl">Write functions</h2>
          <p className="mb-4 text-sm text-amber-300">Advanced operations. Review recipient, amounts and encoded data before signing. Dangerous operations may permanently remove funds or permissions.</p>
          {FUNCTIONS.map((fn) => <FunctionForm key={fn.name} fn={fn} disabled={busy} allowed={canSend(fn.role)} safe={Boolean(safe)} onRun={run} />)}
        </section>
        <section className="glass-card p-5 space-y-3"><h2 className="text-xl">Quick reads</h2>{READS.map(([name, label]) => <p key={name} className="text-sm">{label}: <span className="font-mono">{snapshot ? formatAmount(snapshot.values[name], name === 'POLbalance' ? 18 : undefined) : '—'}</span></p>)}</section>
      </>}
      {output && <section role={output.error ? 'alert' : 'status'} className={`glass-card p-5 ${output.error ? 'text-red-300' : 'text-purple-200'}`}><pre className="whitespace-pre-wrap break-all text-sm">{output.text}</pre>{output.hash && <a className="mt-3 inline-block text-pink-300 underline" href={`${POLYGON_EXPLORER_URL}tx/${output.hash}`} target="_blank" rel="noopener noreferrer">View on Polygonscan</a>}</section>}
    </div>
  );
}

function FunctionForm({ fn, disabled, allowed, safe, onRun }) {
  const [values, setValues] = useState({});
  const buildData = () => contractInterface.encodeFunctionData(fn.name, fn.inputs.map(([name, type]) => parseArgument(type, values[name])));
  return <div className="space-y-3 border-t border-border py-5">
    <h3 className={`break-all font-mono text-sm ${fn.danger ? 'text-red-300' : 'text-pink-300'}`}>{fn.name}</h3>
    <p className="text-sm text-muted-foreground">{ROLE_LABELS[fn.role]} · {fn.description}</p>
    <div className="grid gap-3 sm:grid-cols-3">{fn.inputs.map(([name, type]) => <label key={name} className="space-y-2 text-xs" htmlFor={`${fn.name}-${name}`}>{name} ({type === 'token' ? COINK_SYMBOL : type})<input id={`${fn.name}-${name}`} className={input} value={values[name] || ''} onChange={(event) => setValues({ ...values, [name]: event.target.value })} spellCheck={false} /></label>)}</div>
    <div className="flex gap-3"><button className={button} disabled={disabled || !allowed} onClick={() => onRun(fn.name, fn.role, buildData, false, fn.danger)}>{safe ? 'Propose' : 'Send'}</button><button className={button} disabled={disabled} onClick={() => onRun(fn.name, fn.role, buildData, true, fn.danger)}>Calldata only</button></div>
  </div>;
}
