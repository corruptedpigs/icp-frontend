"use client";

/**
 * Swap Page Feature Flag
 *
 * The swap page is hidden behind a feature flag to allow controlled testing
 * before public release.
 *
 * To unlock:
 *   1. Visit /swap?swap=unlocked  — this stores the flag in localStorage
 *   2. The flag persists across page reloads until cleared
 *   3. To clear: visit /swap?swap=locked  OR clear localStorage key "swap_unlocked"
 *
 * For testers: bookmark https://yoursite.com/swap?swap=unlocked
 */

const STORAGE_KEY = "swap_unlocked";
const UNLOCK_PARAM = "unlocked";
const LOCK_PARAM = "locked";

/**
 * Check & persist the feature flag based on URL params + localStorage.
 * Call this on the client side (useEffect) with the current searchParams.
 * Returns true if swap is unlocked.
 */
export function checkAndPersistSwapFlag(searchParams) {
  if (typeof window === "undefined") return false;

  const param = searchParams?.get?.("swap");

  if (param === UNLOCK_PARAM) {
    localStorage.setItem(STORAGE_KEY, "1");
    return true;
  }

  if (param === LOCK_PARAM) {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }

  return localStorage.getItem(STORAGE_KEY) === "1";
}

/**
 * Pure check (no side effects). Returns true if swap is unlocked.
 */
export function isSwapUnlocked() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}
