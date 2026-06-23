# Branching Strategy

## Branches

- `main` — production. Auto-deploys to the production URL on Vercel.
- `develop` — staging. Auto-deploys to the staging URL on Vercel.
- `feature/*`, `fix/*` — short-lived branches created from `develop`.

## Workflow

1. Create a feature/fix branch from `develop`.
2. Open a PR back into `develop`.
3. Once `develop` is stable and tested on staging, open a PR from
   `develop` into `main` to release to production.

## Environments

| Branch    | Environment | URL                   | Network         |
| --------- | ----------- | --------------------- | --------------- |
| `main`    | Production  | tradeflow.app         | Stellar Mainnet |
| `develop` | Staging     | staging.tradeflow.app | Stellar Testnet |
