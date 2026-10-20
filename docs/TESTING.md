# Running Tests

This project uses Jest and React Testing Library for frontend tests.

## Install dependencies

```bash
npm install
```

## Run the tests

```bash
npm test
```

To run Jest in a single process, which can be useful in CI or when debugging:

```bash
npm test -- --runInBand
```

Wallet tests mock `window.ethereum` and the ethers provider; they do not require a wallet extension or a deployed canister. For details about the current wallet test coverage, see `__tests__/wallet.test.jsx`.
