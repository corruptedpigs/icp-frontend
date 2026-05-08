"use client";

/**
 * Generic feature flag utility
 *
 * Flags are stored in localStorage and activated via URL parameters.
 * This allows unreleased features to be tested on the live site by sharing
 * a secret URL, without any code changes or deployments.
 *
 * Convention:
 *   - URL param name  = the flag name          (e.g. "swap")
 *   - URL param value = "unlocked" to enable   (?swap=unlocked)
 *                       "locked"   to disable  (?swap=locked)
 *   - localStorage key = "<flag>_unlocked"     ("swap_unlocked")
 *
 * Usage:
 *   // In a page client component (useEffect):
 *   import { checkAndPersistFlag, isFlagUnlocked } from "@/app/utils/featureFlags";
 *
 *   // Check + persist on page load (reads URL param + updates localStorage):
 *   const enabled = checkAndPersistFlag("swap", searchParams);
 *
 *   // Pure read (no side effects), e.g. for navbar visibility:
 *   const enabled = isFlagUnlocked("swap");
 */

const UNLOCK_VALUE = "unlocked";
const LOCK_VALUE = "locked";

function storageKey(flag) {
  return `${flag}_unlocked`;
}

/**
 * Check & persist a feature flag based on URL params + localStorage.
 * Call inside a useEffect with the current searchParams.
 *
 * @param {string} flag - Flag name (e.g. "swap"). Must match the URL param name.
 * @param {URLSearchParams|object} searchParams - Next.js searchParams object.
 * @returns {boolean} Whether the flag is currently enabled.
 */
export function checkAndPersistFlag(flag, searchParams) {
  if (typeof window === "undefined") return false;

  const param = searchParams?.get?.(flag);

  if (param === UNLOCK_VALUE) {
    localStorage.setItem(storageKey(flag), "1");
    return true;
  }

  if (param === LOCK_VALUE) {
    localStorage.removeItem(storageKey(flag));
    return false;
  }

  return localStorage.getItem(storageKey(flag)) === "1";
}

/**
 * Pure check (no side effects). Returns true if the flag is enabled.
 *
 * @param {string} flag - Flag name (e.g. "swap").
 * @returns {boolean}
 */
export function isFlagUnlocked(flag) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(storageKey(flag)) === "1";
}
