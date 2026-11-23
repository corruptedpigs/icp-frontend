// Client-side simulation ("test mode") state.
//
// The frontend decides; every API request carries `X-Simulation: on` while this
// is on (see gameApi.js) and the backend obeys only if its Flipper flag allows
// it. Persisted in localStorage and read synchronously so the API wrapper sees
// a change immediately. No env var toggles it.
const STORAGE_KEY = 'simulation-mode';

export const SIMULATION_DISABLED_MESSAGE =
  'Simulation is not available on this server. Test mode was turned off.';

const listeners = new Set();
let lastError = null;

export function isSimulation() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

/** Turns the mode on/off. `error` explains an automatic switch-off. */
export function setSimulation(on, error = null) {
  const changed = isSimulation() !== Boolean(on);
  lastError = on ? null : error;
  try {
    if (on) window.localStorage.setItem(STORAGE_KEY, 'on');
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the mode cannot persist, so never claim it is on.
    lastError = on ? 'Could not enable test mode (browser storage unavailable).' : error;
  }
  if (changed || error) listeners.forEach((fn) => fn());
}

export function clearSimulationError() {
  if (lastError) { lastError = null; listeners.forEach((fn) => fn()); }
}

export function getSimulationError() {
  return lastError;
}

export function subscribeSimulation(fn) {
  listeners.add(fn);
  const onStorage = (e) => { if (e.key === STORAGE_KEY) fn(); }; // other tabs
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(fn);
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}
