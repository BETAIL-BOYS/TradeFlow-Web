# TradeFlow-Web: Stellar Native RWA Dashboard

The frontend interface for the TradeFlow protocol, enabling decentralized invoice factoring and RWA lending on Stellar.

## 🚀 Features

- **Freighter Wallet Integration**: Secure on-chain identity and signing.
- **Real-time Risk Analytics**: Fetched from the TradeFlow-API risk engine.
- **Smart Contract Interaction**: Direct minting of Invoice NFTs via Soroban.

## 🛠 Tech Stack

- **Framework**: Next.js 16
- **Blockchain**: Stellar SDK & Freighter API
- **Styling**: Tailwind CSS & Lucide Icons
- **State Management**: React Query & Zustand

## 🚦 Status

- **Development**: Active
- **CI/CD**: Passing

---

## ⚡ Quick Start (Under 5 Minutes)

### Prerequisites

Make sure you have these installed:

| Software | Version       | Notes                           |
| -------- | ------------- | ------------------------------- |
| Node.js  | 20.x or later | Use nvm if needed (recommended) |
| npm      | 10.x or later | Included with Node.js           |

Optional (for full Soroban smart contract development):

- Rust + Soroban CLI
- Docker (for local Stellar network)

### 1. Clone the Repository

```bash
git clone https://github.com/[your-org]/TradeFlow-Web.git
cd TradeFlow-Web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example env file and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable                                 | Required | Description                                      |
| ---------------------------------------- | -------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SOROBAN_RPC_URL`            | Yes      | Stellar Soroban RPC URL (defaults to Testnet)    |
| `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE` | Yes      | Stellar network passphrase (defaults to Testnet) |
| `NEXT_PUBLIC_INVOICE_CONTRACT_ID`        | No       | Deployed invoice smart contract ID (for minting) |
| `NEXT_PUBLIC_API_URL`                    | No       | Backend API URL (uses mock data if unset)        |
| `PINATA_API_KEY`                         | No       | Pinata API key (for IPFS uploads)                |
| `PINATA_SECRET_API_KEY`                  | No       | Pinata secret key (for IPFS uploads)             |
| `NEXT_PUBLIC_SENTRY_DSN`                 | No       | Sentry DSN for error tracking                    |

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Install Freighter Wallet (Optional but Recommended)

To interact with Stellar features, install the Freighter browser extension:

- [Chrome](https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdbjoeigpddcpfmlplgoago)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/freighter-wallet/)

---

## 🧪 Available Scripts

| Script               | Description                                |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start development server at localhost:3000 |
| `npm run build`      | Build for production                       |
| `npm start`          | Start production server                    |
| `npm run lint`       | Run ESLint                                 |
| `npm run typecheck`  | Run TypeScript type checking               |
| `npm run test`       | Run Jest tests                             |
| `npm run test:watch` | Run tests in watch mode                    |

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Node.js Version Mismatch

```
Error: Unsupported Node.js version
```

**Solution**: Install Node.js 20.x or later. Use `nvm` to manage versions:

```bash
nvm install 20
nvm use 20
```

#### 2. npm Install Fails

```
npm ERR! code ERESOLVE
```

**Solution**: Clear npm cache and retry:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 3. Freighter Wallet Not Connecting

- Ensure Freighter is installed and unlocked
- Check that you're on the correct network (Testnet/Public) in Freighter settings
- Try refreshing the page

#### 4. Stellar Network Errors

- Verify `NEXT_PUBLIC_STELLAR_NETWORK` and RPC URL are correct in `.env.local`
- Check network status: https://status.stellar.org/

#### 5. Missing Contract ID

If you don't have a deployed contract, the minting feature won't work, but the rest of the app will still function.

### Need Help?

If you're still having issues, check the [ARCHITECTURE.md](ARCHITECTURE.md) file for deeper technical details.

---

## 📚 Documentation

- [API Contract](docs/API_CONTRACT.md) - Frontend/backend API contract
- [Architecture](ARCHITECTURE.md) - System architecture overview
- [State Management with Zustand](docs/ZUSTAND_WEB3_IMPLEMENTATION.md)
- [Sentry Integration](docs/SENTRY_INTEGRATION.md)
