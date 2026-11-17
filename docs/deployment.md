# Static deployment to ICP

`dfx.json` uploads the existing `out/` directory. It does not currently run a Next.js build. Rebuild before deploying, or new routes and changes will not be uploaded:

```sh
npm run build
dfx deploy --ic
```

With Next.js 13 and `output: "export"`, the production `distDir` is the export destination. It must be `out` to match this canister's source directory. Setting it to `next-build` exports there instead, leaving `out/` stale. Development uses `.next-dev/` to avoid collisions with the production build cache in `.next/`.

A missing route can return the homepage through the asset canister's fallback, rather than a 404. Before deploying the console, check that `out/coink-console.html` exists.

## Identify the deployed build

Every page includes a build-time tag in its HTML:

```html
<meta name="build-commit" content="FULL_GIT_COMMIT_HASH" />
```

Inspect page source, or run this in the browser console:

```js
document.querySelector('meta[name="build-commit"]')?.content
```

`next.config.js` resolves the local Git HEAD at build time and embeds it in the static output. ICP does not need Git. This identifies the source revision used for the build, not deployment time; uncommitted edits are not identified by the hash. Compare with `git rev-parse HEAD` on the build machine.

For builds without Git metadata, supply the source revision explicitly:

```sh
BUILD_COMMIT_SHA=your-full-commit-hash npm run build
```

Without an override or accessible Git HEAD, the tag reports `unknown`. Existing deployed builds will not have the tag until rebuilt and deployed.
