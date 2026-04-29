/**
 * Stellar integration utilities for TradeFlow.
 * This module handles wallet connections, transaction building, and network interactions.
 */

import { 
  walletKit,
  FREIGHTER_ID,
  XBULL_ID,
  ALBEDO_ID,
  WalletType
} from "@creit.tech/stellar-wallets-kit";
import { 
  Server, 
  TransactionBuilder, 
  Asset, 
  Operation, 
  Networks 
} from "soroban-client";

/**
 * The RPC endpoint for the Stellar network.
 * Currently defaults to the public Soroban Testnet.
 */
const RPC_URL = "https://soroban-testnet.stellar.org";

/**
 * Internal server instance for interacting with the Stellar network.
 */
const server = new Server(RPC_URL);

/**
 * The network passphrase used for transaction signing.
 * Must match the network the transaction is being submitted to.
 */
const NETWORK_PASSPHRASE = Networks.TESTNET;

/**
 * Initialize the wallet kit with a default wallet (Freighter).
 */
walletKit.setWallet(FREIGHTER_ID);

/**
 * Represents the information returned after a successful wallet connection.
 */
export interface WalletInfo {
  /** The public G-address of the connected Stellar account */
  publicKey: string;
  /** The type of wallet used for connection (e.g., freighter, xbull) */
  walletType: WalletType;
}

/**
 * Connects to a Stellar wallet using the wallet kit.
 * Supports multiple providers including Freighter, Albedo, and xBull.
 * 
 * @param {WalletType} walletType - The ID of the wallet provider to use.
 * @returns {Promise<WalletInfo>} A promise that resolves to the wallet information.
 * @throws {Error} If the wallet is not installed or the wrong network is selected.
 */
export async function connectWallet(walletType: WalletType = FREIGHTER_ID): Promise<WalletInfo> {
  try {
    // 1. Configure the kit to use the requested wallet provider
    walletKit.setWallet(walletType);
    
    // 2. Ensure the extension or provider is available in the browser
    const isWalletAvailable = await walletKit.isWalletAvailable();
    if (!isWalletAvailable) {
      const walletName = getWalletName(walletType);
      throw new Error(`${walletName} is not available. Please install it to continue.`);
    }

    // 3. Request the public key from the user
    const publicKey = await walletKit.getPublicKey();
    
    if (!publicKey) {
      throw new Error("Unable to retrieve public key.");
    }

    // 4. Validate that the user is on the expected network (Testnet)
    const network = await walletKit.getNetwork();
    if (network !== "TESTNET") {
      const walletName = getWalletName(walletType);
      throw new Error(`Invalid network: ${network}. Please switch to TESTNET in ${walletName} settings.`);
    }

    return { publicKey, walletType };
  } catch (error: any) {
    // Log error for debugging but propagate to the caller
    console.error("Wallet connection error:", error);
    throw error;
  }
}

/**
 * Retrieves information about the currently connected wallet if available.
 * 
 * @returns {Promise<WalletInfo | null>} The wallet info or null if disconnected.
 */
export async function getConnectedWallet(): Promise<WalletInfo | null> {
  try {
    const publicKey = await walletKit.getPublicKey();
    if (!publicKey) return null;
    
    const currentWallet = walletKit.getWallet();
    return { publicKey, walletType: currentWallet };
  } catch (error) {
    // Silently return null on error as it usually means no wallet is active
    return null;
  }
}

/**
 * Terminates the current wallet session.
 * 
 * @returns {Promise<void>}
 */
export async function disconnectWallet(): Promise<void> {
  try {
    await walletKit.disconnect();
  } catch (error) {
    console.error("Wallet disconnection error:", error);
  }
}

/**
 * Maps internal wallet IDs to human-readable display names.
 * 
 * @param {WalletType} walletType - The internal ID of the wallet.
 * @returns {string} The display name (e.g., "Freighter").
 */
function getWalletName(walletType: WalletType): string {
  switch (walletType) {
    case FREIGHTER_ID:
      return "Freighter";
    case XBULL_ID:
      return "xBull";
    case ALBEDO_ID:
      return "Albedo";
    default:
      return "Wallet";
  }
}

/**
 * Monitors the status of a Stellar transaction until it succeeds, fails, or times out.
 * This function uses a polling mechanism to check the Horizon server.
 * 
 * @param {string} hash - The transaction hash to monitor.
 * @returns {Promise<string>} Promise that resolves to "SUCCESS" if successful.
 * @throws {Error} If the transaction fails or the polling times out.
 */
export async function waitForTransaction(hash: string): Promise<string> {
  const TIMEOUT_MS = 30000; // 30 seconds timeout
  const POLLING_INTERVAL_MS = 2000; // Poll every 2 seconds
  const startTime = Date.now();

  console.log(`[waitForTransaction] Starting monitoring for transaction: ${hash}`);

  while (Date.now() - startTime < TIMEOUT_MS) {
    try {
      // Fetch transaction status from the Horizon server
      const tx = await server.getTransaction(hash);
      
      console.log(`[waitForTransaction] Polling ${hash}: Status = ${tx.status}`);

      if (tx.status === "SUCCESS") {
        console.log(`[waitForTransaction] Transaction ${hash} confirmed successfully.`);
        return "SUCCESS";
      } else if (tx.status === "FAILED") {
        console.error(`[waitForTransaction] Transaction ${hash} failed.`);
        throw new Error(`Transaction failed with status: ${tx.status}`);
      }
      
      // If status is NOT_FOUND or other pending states, continue polling
    } catch (error: any) {
      // Log warning but continue polling (common for 404 Not Found initially)
      console.warn(`[waitForTransaction] Polling attempt failed (retrying): ${error.message}`);
    }

    // Wait before next poll attempt
    await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
  }

  // Timeout reached if we exit the loop
  const errorMsg = `Transaction monitoring timed out after ${TIMEOUT_MS / 1000}s for hash: ${hash}`;
  console.error(`[waitForTransaction] ${errorMsg}`);
  throw new Error(errorMsg);
}

/**
 * Establishes a trustline for a specific Stellar asset.
 * This is required before an account can hold or receive a non-native asset.
 * 
 * @param {string} assetCode - The code of the asset (e.g., "USDC").
 * @param {string} assetIssuer - The public G-address of the asset issuer.
 * @param {WalletType} [walletType] - Optional wallet provider override.
 * @returns {Promise<string>} The status of the transaction.
 */
export async function addTrustline(assetCode: string, assetIssuer: string, walletType?: WalletType) {
  // Update wallet provider if specified
  if (walletType) {
    walletKit.setWallet(walletType);
  }
  
  const publicKey = await walletKit.getPublicKey();
  
  // 1. Fetch current account state for sequence number
  const account = await server.getAccount(publicKey);
  const asset = new Asset(assetCode, assetIssuer);
  
  // 2. Build the ChangeTrust transaction
  const transaction = new TransactionBuilder(account, {
    fee: "1000", // Fixed fee of 1000 stroops for demo
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.changeTrust({ asset }))
    .setTimeout(60) // 60 seconds transaction validity
    .build();

  // 3. Request user signature via the selected wallet
  const xdr = transaction.toXDR();
  const signedXdr = await walletKit.signTransaction(xdr, {
    network: "TESTNET",
  });

  // 4. Submit the signed transaction to the network
  const response = await server.sendTransaction(transaction);
  
  if (response.hash) {
    // 5. Wait for ledger confirmation
    return await waitForTransaction(response.hash);
  }
  
  throw new Error("Transaction failed during submission.");
}

/**
 * Signs a raw XDR transaction using the active wallet.
 * 
 * @param {string} xdr - The base64 encoded transaction XDR.
 * @param {any} [options] - Additional signing options.
 * @returns {Promise<string>} The signed transaction XDR.
 */
export async function signTransaction(xdr: string, options?: any): Promise<string> {
  return await walletKit.signTransaction(xdr, {
    network: "TESTNET",
    ...options
  });
}

/**
 * Queries the active network configuration from the connected wallet.
 * 
 * @returns {Promise<string>} The network identifier (e.g., "TESTNET").
 */
export async function getNetwork(): Promise<string> {
  return await walletKit.getNetwork();
}

/**
 * Quick check to see if a wallet is currently active and reachable.
 * 
 * @returns {Promise<boolean>} True if a public key can be retrieved.
 */
export async function isWalletConnected(): Promise<boolean> {
  try {
    const publicKey = await walletKit.getPublicKey();
    return !!publicKey;
  } catch {
    return false;
  }
}

/**
 * Utility to shorten a Stellar address for UI display.
 * 
 * @param {string} address - The full Stellar address.
 * @param {number} [chars=4] - Number of characters to show at start and end.
 * @returns {string} The shortened address (e.g., GABC...XYZ).
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2) return address;
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

// Re-export constants and types for downstream usage
export { 
  walletKit,
  FREIGHTER_ID, 
  XBULL_ID, 
  ALBEDO_ID, 
  WalletType 
};

