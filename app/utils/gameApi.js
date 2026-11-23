// Shared helpers for the game backend (Rails API). No secrets live here.
// EVERY request to the API goes through fetchGameApi, which adds
// `X-Simulation: on` while test mode is active.
import { isSimulation, setSimulation, SIMULATION_DISABLED_MESSAGE } from "./simulation";

export const GAME_API_BASE = process.env.NEXT_PUBLIC_GAME_API_URL || "http://localhost:3000";

const DEFAULT_UNAVAILABLE = "The game service is unavailable. Please try again later.";

/** Thrown when the backend refuses simulation; test mode has been turned off. */
export class SimulationRejectedError extends Error {
  constructor() {
    super(SIMULATION_DISABLED_MESSAGE);
    this.name = "SimulationRejectedError";
  }
}

/** Turns simulation off with a visible reason and returns the error to throw. */
function rejectSimulation() {
  setSimulation(false, SIMULATION_DISABLED_MESSAGE);
  return new SimulationRejectedError();
}

/** Adds `?simulation=on` (ActionCable handshakes cannot carry headers). */
export function withSimulationParam(url) {
  if (!isSimulation()) return url;
  const parsed = new URL(url);
  parsed.searchParams.set("simulation", "on");
  return parsed.href;
}

/**
 * Fetches the API without exposing browser/network diagnostics to players.
 * `simulationOnly` marks endpoints that exist only in simulation, where a 404
 * also means "simulation not allowed". A 403 while simulating always does.
 * Never falls back to real mode: the mode is switched off and the call fails.
 */
export async function fetchGameApi(path, options, serviceUnavailableMessage = DEFAULT_UNAVAILABLE, { simulationOnly = false } = {}) {
  const simulation = isSimulation();
  let response;
  try {
    const origin = new URL(GAME_API_BASE).origin;
    const init = simulation
      ? { ...options, headers: { ...(options?.headers || {}), "X-Simulation": "on" } }
      : options;
    response = await fetch(`${origin}${path}`, init);
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    // Browsers report offline, DNS, CORS, and connection-refused failures as
    // generic TypeErrors (often just "Failed to fetch"). Keep that detail out
    // of the player-facing error.
    throw new Error(serviceUnavailableMessage);
  }

  if (simulation && (response.status === 403 || (simulationOnly && response.status === 404))) {
    throw rejectSimulation();
  }
  if (response.status >= 500) {
    throw new Error(serviceUnavailableMessage);
  }
  return response;
}

export async function readJson(response, fallbackMessage) {
  try {
    return await response.json();
  } catch {
    throw new Error(fallbackMessage);
  }
}

/**
 * Simulation only: GET /api/v1/players/:wallet/cards.
 * Resolves to `{ wallet, collection, cards: [...] }`.
 */
export async function fetchPlayerCards(address, messages = {}, { signal } = {}) {
  const failure = messages.failure || "Could not load your cards.";
  const res = await fetchGameApi(
    `/api/v1/players/${encodeURIComponent(String(address).toLowerCase())}/cards`,
    { signal },
    messages.unavailable || DEFAULT_UNAVAILABLE,
    { simulationOnly: true }
  );
  if (!res.ok) throw new Error(failure);
  const data = await readJson(res, failure);
  if (!Array.isArray(data?.cards)) throw new Error(failure);
  return data;
}

/** Simulation only: POST /api/v1/auth/simulate { wallet } → bearer token (no SIWE). */
export async function fetchSimulatedToken(address, messages = {}) {
  const failure = messages.failure || "Could not sign in.";
  const res = await fetchGameApi("/api/v1/auth/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet: address }),
  }, messages.unavailable || DEFAULT_UNAVAILABLE, { simulationOnly: true });
  if (!res.ok) throw new Error(failure);
  const data = await readJson(res, failure);
  if (!data?.token) throw new Error(failure);
  return data.token;
}
