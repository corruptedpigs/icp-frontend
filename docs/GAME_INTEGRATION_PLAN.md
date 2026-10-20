# Game Integration Plan

## Action Cable matchmaking notifications

The frontend now waits through Action Cable in `app/utils/matchmaking.js`, used
by `app/hooks/useJoinGame.js`. It subscribes using the HTTP matchmaking response's
`matchmaking_token`, resolves on `matched`, and times out after 90 seconds.
Action Cable reconnects automatically. Polling is not used in this flow.

### Running locally, in production, and through Cloudflare Tunnel

- Local: Rails on port 3000, frontend on port 3001. Set
  `NEXT_PUBLIC_GAME_API_URL=http://localhost:3000` in `.env.local` and start Next
  with `npm run dev -- --port 3001`. Cable uses `ws://localhost:3000/cable`.
- Production: set `NEXT_PUBLIC_GAME_API_URL=https://api.corruptedpigs.com`.
  Cable uses `wss://api.corruptedpigs.com/cable`. Rails must allow
  `https://corruptedpigs.com` in both HTTP CORS and Action Cable allowed origins.
  Allow `https://www.corruptedpigs.com` too if serving that frontend origin.
- Tunnel testing: run `cloudflared tunnel --url http://localhost:3000` for Rails
  and `cloudflared tunnel --url http://localhost:3001` for Next.js. Set
  `NEXT_PUBLIC_GAME_API_URL=https://<backend-tunnel>.trycloudflare.com` in
  `.env.local`, restart Next.js, and share the **frontend** tunnel URL.
  Remote players cannot reach your `localhost`; both browsers must use the
  public backend URL. HTTPS tunnels automatically use secure `wss` cable URLs.
- Rails must allow the exact **frontend tunnel origin** for both CORS and
  `config.action_cable.allowed_request_origins`, and accept the backend tunnel
  hostname in its host authorization configuration. Quick-tunnel URLs change
  when restarted: update these settings and the frontend API URL accordingly.
  Do not broadly disable origin checks for production. CORS alone does not
  configure WebSocket access.
- `NEXT_PUBLIC_*` values are embedded in the frontend: restart the development
  server after changes, and rebuild for production changes. An API URL ending
  in `/api/v1` also works: HTTP requests use the existing `/api/v1/...` paths
  from its origin, and cable always uses `/cable` from that origin.

Use browser DevTools → Network → WS to confirm a `/cable` connection, subscription
confirmation, and a `matched` message when the second player joins. Test two
different wallets. `npm test -- --runInBand __tests__/matchmaking.test.js` tests
URL derivation, matched events, rejection, timeout, and cancellation without Rails.

### Endpoint configuration

`NEXT_PUBLIC_GAME_API_URL` is the HTTP API base URL. Action Cable usually runs
on the same server, but at a separate endpoint, conventionally `/cable`:

| HTTP API base | Conventional WebSocket endpoint |
| --- | --- |
| `http://localhost:3000` | `ws://localhost:3000/cable` |
| `https://api.example.com` | `wss://api.example.com/cable` |

Derive the default from the API origin, replacing `http`/`https` with `ws`/`wss`
and setting the path to `/cable`. Allow an explicit
`NEXT_PUBLIC_GAME_CABLE_URL` override for deployments with a different cable host
or path. Confirm Rails mounts Action Cable there and permits the frontend origin
in `config.action_cable.allowed_request_origins`; the production proxy must
support WebSocket upgrades. These public URLs are not credentials.

### Backend contract

- The waiting response from `POST /api/v1/matchmaking` must expose the
  `matchmaking_token` expected by `MatchmakingChannel` (confirm the JSON key).
  The SIWE bearer token and `session_id` are **not** substitutes for this token.
- Subscribe with `{ channel: "MatchmakingChannel", token: matchmakingToken }`.
- The backend broadcasts `{ type: "matched", vs_cpu: boolean, session_id: string }`
  when another player joins. The channel also transmits this message on
  subscription if the session is no longer waiting, closing the race between
  joining matchmaking and subscribing.
- Confirm whether statuses other than waiting include cancelled/expired games:
  the supplied channel treats every non-waiting status as matched. Cancelled or
  expired sessions should not cause the frontend to start a game.

### Frontend implementation

1. Add the official `@rails/actioncable` client; do not use a plain WebSocket
   without implementing Action Cable's subscription protocol.
2. Keep HTTP nonce retrieval, SIWE verification, and joining matchmaking.
3. Keep immediate-match/CPU responses working without opening a subscription.
4. For waiting responses, set `isWaiting`, subscribe using the matchmaking token,
   and resolve `joinGame()` on the first valid `matched` message. Normalize
   `vs_cpu` and `session_id` to the existing result shape before navigating.
5. Preserve the waiting overlay and timeout. Handle subscription rejection and
   connection failure; optionally use the existing polling as a fallback, not
   concurrently during a healthy subscription.
6. Unsubscribe, disconnect the consumer, and clear timers on success, timeout,
   error, wallet changes, and component unmount. Ignore duplicate/late messages.

### Tests and manual verification

Mock the Action Cable consumer to test subscription parameters, immediate matches,
matched events, duplicate messages, rejection, timeout, reconnect delivery, and
cleanup on unmount. Assert that healthy WebSocket matchmaking does not poll.
Test in two real browser sessions against Rails: the first player sees
“Waiting for opponent…” and both enter the game after the second player joins.
Also test losing and restoring the connection after a match has been created.

## Result reporting overview

When a Corrupted Pigs logic/strength match ends, the result must be reported to an
external off-chain API so that on-chain NFT state (ownership transfers, burn-power
increments, etc.) can be updated on Polygon.

## Architecture

```
Browser (Next.js)
    │
    │  calls ICP canister via @dfinity/agent
    ▼
GameFunctionality canister  (Motoko, on ICP)
    │
    │  ICP HTTPS Outcall (management canister aaaaa-aa)
    ▼
External Game Result API  (off-chain, Polygon-side)
```

The API key and target URL are stored **only** in the Motoko canister as stable
variables, set post-deploy by the controller via `setGameResultApiKey` and
`setGameResultApiUrl`. They are never returned by any public query, never appear
in the Next.js codebase, and never appear in git.

## Why not a Next.js proxy?

A Next.js API route (`/api/game/result`) would accept the result from the browser
and forward it to the external API. This has two problems:

1. **Trust** — the browser supplies the winner/loser; anyone could forge the call.
2. **Correctness** — the authoritative result lives in the canister
   (`checkWinner`). Routing through the browser adds a redundant hop and a
   forgery vector.

The canister already knows both players, their selected cards, and the guessed
orders. It determines the winner and fires the HTTP POST itself, with no browser
involvement after the `checkWinner` call.

## Motoko HTTPS Outcall

```motoko
// ICP management canister HTTP interface (subset)
let ic : actor {
  http_request : shared (HttpRequestArgs) -> async HttpResponse;
} = actor "aaaaa-aa";

// Called internally after checkWinner resolves
func _notifyGameResult(
  winner : Text,
  loser  : Text,
  tokenIdCardA      : Text,
  tokenIdCardB      : Text,
  tokenIdLost       : Text,
  tokenIdToAddPower : Text,
) : async () {
  let body = Text.encodeUtf8(
    "{"
    # "\"apiKey\":\""           # _gameResultApiKey       # "\","
    # "\"winner\":\""           # winner                  # "\","
    # "\"loser\":\""            # loser                   # "\","
    # "\"tokenIdCardA\":\""     # tokenIdCardA            # "\","
    # "\"tokenIdCardB\":\""     # tokenIdCardB            # "\","
    # "\"tokenIdLost\":\""      # tokenIdLost             # "\","
    # "\"tokenIdToAddPower\":\"" # tokenIdToAddPower      # "\""
    # "}"
  );
  let request : HttpRequestArgs = {
    url             = _gameResultApiUrl;
    max_response_bytes = ?2000;
    headers         = [{ name = "Content-Type"; value = "application/json" }];
    body            = ?body;
    method          = #post;
    transform       = null;
  };
  Cycles.add<system>(20_000_000_000);
  ignore await ic.http_request(request);
};
```

## Secret Management

| Secret             | Where stored                        | How set                                 |
|--------------------|-------------------------------------|-----------------------------------------|
| API key            | `stable var _gameResultApiKey`      | `setGameResultApiKey(key)` — controller only |
| API URL            | `stable var _gameResultApiUrl`      | `setGameResultApiUrl(url)` — controller only |

Post-deploy workflow:

```bash
dfx canister --network ic call <canister-id> setGameResultApiKey '("<key>")'
dfx canister --network ic call <canister-id> setGameResultApiUrl '("<url>")'
```

The values survive canister upgrades because the variables are `stable`.

## Token ID Mapping

The external API expects six fields. The canister maps them from the match state:

| API field           | Source in canister                              |
|---------------------|-------------------------------------------------|
| `winner`            | Winning `Player.id` (wallet address)            |
| `loser`             | Losing `Player.id`                              |
| `tokenIdCardA`      | First card of winner's `selectedCards`          |
| `tokenIdCardB`      | First card of loser's `selectedCards`           |
| `tokenIdLost`       | First card of loser's `selectedCards` (same)    |
| `tokenIdToAddPower` | First card of winner's `selectedCards` (same)   |

The exact mapping may be refined once the external API contract is finalised.

## Cycles Budget

Each HTTPS Outcall consumes cycles. A budget of `20_000_000_000` cycles
(20 billion, ~0.00003 ICP at current prices) is attached per call, which covers
the typical cost of a small outbound POST.

Ensure the canister's cycles balance is monitored and topped up as needed.

---

## Deployment To-Do

Steps required to get `GameFunctionality` live on mainnet. Work through them in
order — each step depends on the previous one.

### Prerequisites (check before starting)

| # | Check | Notes |
|---|-------|-------|
| P1 | Controller wallet has ICP to cover canister creation + initial cycles | Check with `dfx ledger --network ic balance`; creating a canister costs ~0.1–0.3 T cycles (~0.05–0.15 ICP at current rates) |
| P2 | You have the external API URL and API key ready | Needed in step 7 & 8 — do not commit them anywhere |
| P3 | `mops` CLI is installed | `npm install -g ic-mops`; verify with `mops --version` |

---

### Step 1 — Install Mops

```bash
npm install -g ic-mops
```

### Step 2 — Initialise `mops.toml` and add dependencies

Run from the repo root:

```bash
mops init
mops add map
mops add vector
```

This creates `mops.toml` and a `mops.lock` — both should be committed.

### Step 3 — Add the canister to `dfx.json`

Add the following entry to the `"canisters"` object in `dfx.json`:

```json
"game_functionality": {
  "type": "motoko",
  "main": "backend/game/gameFunctionality.mo",
  "packtool": "mops sources"
}
```

> `"packtool": "mops sources"` tells dfx to resolve Motoko packages via Mops.

### Step 4 — Build locally (verify no compile errors)

```bash
mops install
dfx build game_functionality
```

Fix any Motoko type errors before proceeding.

### Step 5 — Deploy to mainnet

```bash
dfx deploy --network ic game_functionality
```

dfx will create a new canister, fund it with cycles from the controller's ICP
balance, and print the new canister ID. Save it — you need it in steps 6–8.

### Step 6 — Record the canister ID

After deploy, `canister_ids.json` will be updated automatically with the new ID
under `"game_functionality"`. Commit that file.

### Step 7 — Set the API URL

```bash
dfx canister --network ic call game_functionality setGameResultApiUrl '("<url>")'
```

### Step 8 — Set the API key

```bash
dfx canister --network ic call game_functionality setGameResultApiKey '("<key>")'
```

> The key is written directly into the canister's stable memory. It never
> touches the filesystem, git, or the browser.

### Step 9 — Verify

```bash
dfx canister --network ic status game_functionality
```

Confirm `Status: Running` and note the starting cycles balance.

---

### Future / Backlog

- [ ] Refine token ID mapping (`tokenIdLost`, `tokenIdToAddPower`) once the
      external API contract is finalised
- [ ] Wire the Next.js frontend to call `joinGame`, `selectCards`, `guessOrder`,
      and `checkWinner` on the deployed canister ID
- [ ] Set up a cycles-balance alert (e.g. via IC monitoring or a cron that calls
      `dfx canister status` and pages if balance drops below a threshold)

- [ ] Implement waiting for opponent during join flow
-   The `useJoinGame` hook now polls `/api/v1/game_sessions/:id` until an
-   opponent joins or a timeout occurs. See the hook implementation in
-   `app/hooks/useJoinGame.js`.
-   The UI shows a spinner while waiting.
