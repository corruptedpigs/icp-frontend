"use client";

// Temporary "Test mode" toggle + banner. Remove together with SimulationContext.
import { useSimulation } from "../context/SimulationContext";

export default function SimulationControls() {
  const { simulation, error, toggle, dismissError } = useSimulation();
  return (
    <>
      {simulation && (
        <div role="status" className="fixed top-0 inset-x-0 z-[60] bg-yellow-400 text-black text-center text-xs font-bold uppercase tracking-widest py-1">
          SIMULATION — test mode, no real chain or NFTs
        </div>
      )}
      {error && (
        <div role="alert" className="fixed top-20 left-1/2 -translate-x-1/2 z-50 alert alert-error shadow-lg w-[calc(100vw-2rem)] max-w-lg">
          <span className="min-w-0 whitespace-pre-wrap">{error}</span>
          <button type="button" className="btn btn-xs" onClick={dismissError}>Dismiss</button>
        </div>
      )}
      <button
        id="simulation-toggle"
        type="button"
        onClick={toggle}
        aria-pressed={simulation}
        className={`btn btn-xs uppercase ${simulation ? "btn-warning" : "btn-outline text-white"}`}
      >
        Test mode: {simulation ? "on" : "off"}
      </button>
    </>
  );
}
