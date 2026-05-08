# Feature Flags

## Overview

Features that are not ready for public release are gated behind a **localStorage-based feature flag**, activated by a secret URL parameter. This allows internal testing on the live site without exposing the feature to regular users.

Reference implementation: the Swap page (`/swap`).

## How It Works

1. Share a URL with the unlock parameter: `https://corruptedpigs.com/swap?swap=unlocked`
2. On load, the flag is stored in `localStorage` under the key `swap_unlocked`
3. The flag persists across page reloads and browser restarts
4. To revoke: visit `/swap?swap=locked`, or clear `localStorage.removeItem("swap_unlocked")`

## Utility — `app/utils/featureFlags.js`

```js
import { checkAndPersistFlag, isFlagUnlocked } from "@/app/utils/featureFlags";
```

| Function | When to use |
|---|---|
| `checkAndPersistFlag(flag, searchParams)` | Call in `useEffect` with `useSearchParams()` — reads URL param, persists to localStorage, returns boolean |
| `isFlagUnlocked(flag)` | Pure read — use in components that just need to check (e.g. navbar link visibility) |

The `flag` argument is the URL param name and the localStorage key prefix (e.g. `"swap"` → param `?swap=unlocked`, key `swap_unlocked`).

## Adding a New Feature Flag

1. Choose a short flag name — it becomes both the URL param and the localStorage key prefix (e.g. `"marketplace"`)
2. In the page client component, call `checkAndPersistFlag("marketplace", searchParams)` in a `useEffect`
3. Show a clear locked state UI when not unlocked (see `LockedState` in `app/swap/SwapPageClient.js`)
4. Add the feature nav link gated behind `isFlagUnlocked("marketplace")` in the appropriate navbar

## Example Pattern

```jsx
// app/myfeature/MyFeaturePageClient.js
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { checkAndPersistFlag } from "../utils/featureFlags";

export default function MyFeaturePageClient() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setUnlocked(checkAndPersistFlag("myfeature", searchParams));
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
