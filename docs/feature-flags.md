# Feature Flags

## Overview

Features that are not ready for public release are gated behind a **localStorage-based feature flag**, activated by a secret URL parameter. This allows internal testing on the live site without exposing the feature to regular users.

Reference implementation: the Swap page (`/swap`).

## How It Works

1. Share a URL with the unlock parameter: `https://corruptedpigs.com/swap?swap=unlocked`
2. On load, the flag is stored in `localStorage` under the key `swap_unlocked`
3. The flag persists across page reloads and browser restarts
4. To revoke: visit `/swap?swap=locked`, or clear `localStorage.removeItem("swap_unlocked")`

## Utility — `app/utils/swapFeatureFlag.js`

```js
import { checkAndPersistSwapFlag, isSwapUnlocked } from "@/app/utils/swapFeatureFlag";
```

| Function | When to use |
|---|---|
| `checkAndPersistSwapFlag(searchParams)` | Call in `useEffect` with `useSearchParams()` — reads URL param, persists to localStorage, returns boolean |
| `isSwapUnlocked()` | Pure read — use in components that just need to check (e.g. navbar link visibility) |

## Adding a New Feature Flag

1. Add a new storage key and param pair to `swapFeatureFlag.js` (or create a new utils file for the feature)
2. In the page client component, call `checkAndPersistSwapFlag` in a `useEffect` and gate rendering behind the result
3. Show a clear locked state UI when not unlocked (see `LockedState` in `app/swap/SwapPageClient.js`)
4. Add the feature nav link to the appropriate navbar, gated behind `isSwapUnlocked()` (or equivalent)

## Example Pattern

```jsx
// app/myfeature/MyFeaturePageClient.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { checkAndPersistSwapFlag } from "../utils/swapFeatureFlag";

export default function MyFeaturePageClient() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setUnlocked(checkAndPersistSwapFlag(searchParams));
    setChecking(false);
  }, [searchParams]);

  if (checking) return null;
  if (!unlocked) return <LockedState />;
  return <YourFeatureUI />;
}
```

```jsx
// app/myfeature/page.js — server component, wraps in Suspense (required for static export)
import { Suspense } from "react";
import MyFeaturePageClient from "./MyFeaturePageClient";

export default function MyFeaturePage() {
  return (
    <Suspense fallback={null}>
      <MyFeaturePageClient />
    </Suspense>
  );
}
```

## Security Note

This flag is intended for **access control to UI only** — it is not a security boundary. Anyone who discovers the URL parameter can unlock the feature. Do not use this pattern to gate sensitive operations; use it only to hide early-stage UI from casual users during testing.
