"use client";

// Temporary "test mode" state for React. To remove the feature: delete this
// file, SimulationControls.js, app/utils/simulation.js and their usages.
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import { clearSimulationError, getSimulationError, isSimulation, setSimulation, subscribeSimulation } from '../utils/simulation';

const SimulationContext = createContext(null);

function useSimulationState() {
  const simulation = useSyncExternalStore(subscribeSimulation, isSimulation, () => false);
  const error = useSyncExternalStore(subscribeSimulation, getSimulationError, () => null);
  const toggle = useCallback(() => setSimulation(!isSimulation()), []);
  return useMemo(() => ({
    simulation, error, toggle,
    setSimulation,
    dismissError: clearSimulationError,
  }), [simulation, error, toggle]);
}

export function SimulationProvider({ children }) {
  const value = useSimulationState();
  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

/** Works with or without the provider (tests, isolated components). */
export function useSimulation() {
  const ctx = useContext(SimulationContext);
  const fallback = useSimulationState();
  return ctx ?? fallback;
}
