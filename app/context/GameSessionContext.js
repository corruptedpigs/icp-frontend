"use client";

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useWallet } from './WalletContext';
import styles from '../../styles/Game.module.css';

const GameSessionContext = createContext(null);

export function GameSessionProvider({ children }) {
  const { account } = useWallet();
  const [session, setSession] = useState(null);
  const [showArrival, setShowArrival] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audio = useRef(null);
  const sessionAccount = useRef(null);
  const opponentReady = Boolean(account && session?.account === account && session.match?.matched);

  useEffect(() => {
    setSession(null);
    setShowArrival(false);
    sessionAccount.current = null;
  }, [account]);

  useEffect(() => () => {
    audio.current?.context.close().catch(() => {});
  }, []);

  function beginJoin() {
    setSession(null);
    setShowArrival(false);
    sessionAccount.current = account;
    if (!soundEnabled) return;
    // Resume synchronously inside the Join click, before wallet/network awaits.
    // Keep this context alive so a match can sound even in a background tab.
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audio.current) {
        const context = new AudioContext();
        const buffer = fetch('/sounds/02.ogg')
          .then(response => {
            if (!response.ok) throw new Error('Sound unavailable');
            return response.arrayBuffer();
          })
          .then(data => context.decodeAudioData(data))
          .catch(() => null);
        audio.current = { context, buffer };
      }
      audio.current.context.resume().catch(() => {});
    } catch {
      // Audio is optional; unsupported/blocked playback must not prevent joining.
    }
  }

  function completeJoin(match) {
    if (!account || sessionAccount.current !== account || !match?.matched) return;
    setSession({ account, match });
    setShowArrival(true);
    const prepared = audio.current;
    if (soundEnabled && prepared) {
      prepared.buffer.then(buffer => {
        if (!buffer || prepared.context.state !== 'running') return;
        const source = prepared.context.createBufferSource();
        source.buffer = buffer;
        source.connect(prepared.context.destination);
        source.start();
      }).catch(() => {});
    }
  }

  return (
    <GameSessionContext.Provider value={{ opponentReady, beginJoin, completeJoin, soundEnabled, setSoundEnabled }}>
      {children}
      {showArrival && opponentReady && (
        <div role="status" aria-live="polite" className={styles.opponentArrival}>
          <span aria-hidden="true" className={styles.arrivalPulse} />
          <div>
            <p className="font-bold text-xl uppercase tracking-wider">Opponent joined!</p>
            <p>Your game is ready. Select your squad.</p>
          </div>
          <button type="button" className="btn btn-sm btn-warning" onClick={() => setShowArrival(false)}>
            Got it
          </button>
        </div>
      )}
    </GameSessionContext.Provider>
  );
}

export function useGameSession() {
  return useContext(GameSessionContext);
}
