import {
  Server,
  TransactionBuilder,
  Asset,
  Operation,
  Networks,
} from "soroban-client";
import {
  WalletConnector,
  WalletInfo,
  WalletType,
  createWalletConnector,
  FREIGHTER_ID,
  XBULL_ID,
  ALBEDO_ID
} from "./walletConnector";

// Re-export WalletType for backward compatibility
export { WalletType };

/**
 * The RPC endpoint for the Stellar network.
 * Currently defaults to the public Soroban Testnet.
 */
const RPC_URL = "https://soroban-testnet.stellar.org";

/**
 * Internal server instance for interacting with the Stellar network.
 */
const server = new Server(RPC_URL);
const NETWORK_PASSPHRASE = Networks.TESTNET;

// Global wallet connector instance
let currentWalletConnector: WalletConnector | null = null;

/**
 * Connects to a Stellar wallet using the unified wallet connector.
 * Supports Freighter, Albedo, and xBull wallets.
 */
export async function connectWallet(walletType: WalletType = FREIGHTER_ID): Promise<WalletInfo> {
  try {
    const connector = createWalletConnector(walletType);
    const walletInfo = await connector.connect();
    currentWalletConnector = connector;
    return walletInfo;
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
  if (!currentWalletConnector) return null;
  
  try {
    const isConnected = await currentWalletConnector.isConnected();
    if (!isConnected) return null;
    
    const publicKey = await currentWalletConnector.getPublicKey();
    return { publicKey, walletType: currentWalletConnector.getWalletType() };
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
  if (!currentWalletConnector) return;
  
  try {
    await currentWalletConnector.disconnect();
    currentWalletConnector = null;
  } catch (error) {
    console.error("Wallet disconnection error:", error);
  }
}


/**
 * Monitors the status of a Stellar transaction until it succeeds, fails, or times out.
 * Polls the network every 2 seconds.
 *
 * @param hash - The transaction hash to monitor
 * @returns Promise that resolves to "SUCCESS" if successful
 */
export async function waitForTransaction(hash: string): Promise<string> {
  const TIMEOUT_MS = 30000; // 30 seconds timeout
  const POLLING_INTERVAL_MS = 2000; // Poll every 2 seconds
  const startTime = Date.now();

  console.log(
    `[waitForTransaction] Starting monitoring for transaction: ${hash}`,
  );

  while (Date.now() - startTime < TIMEOUT_MS) {
    try {
      // Fetch transaction status from the Horizon server
      const tx = await server.getTransaction(hash);

      console.log(
        `[waitForTransaction] Polling ${hash}: Status = ${tx.status}`,
      );

      if (tx.status === "SUCCESS") {
        console.log(
          `[waitForTransaction] Transaction ${hash} confirmed successfully.`,
        );
        return "SUCCESS";
      } else if (tx.status === "FAILED") {
        console.error(`[waitForTransaction] Transaction ${hash} failed.`);
        throw new Error(`Transaction failed with status: ${tx.status}`);
      }

      // If status is NOT_FOUND or other pending states, continue polling
    } catch (error: any) {
      // Log error but continue polling (common for 404 Not Found initially)
      console.warn(
        `[waitForTransaction] Polling attempt failed (retrying): ${error.message}`,
      );
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
  const connector = walletType ? createWalletConnector(walletType) : currentWalletConnector;
  if (!connector) throw new Error("No wallet connector available.");
  
  const publicKey = await connector.getPublicKey();
  
  // 1. Fetch current account state for sequence number
  const account = await server.getAccount(publicKey);
  const asset = new Asset(assetCode, assetIssuer);

  const transaction = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.changeTrust({ asset }))
    .setTimeout(60) // 60 seconds transaction validity
    .build();

  const xdr = transaction.toXDR();
  const signedTxXdr = await connector.signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

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
export async function signTransaction(
  xdr: string,
  options?: any,
): Promise<string> {
  if (!currentWalletConnector) throw new Error("No wallet connector available.");
  
  try {
    // Import here to avoid circular dependencies
    const { useSignatureStore } = await import('../stores/signatureStore');
    const signatureStore = useSignatureStore.getState();
    
    // Start global signing state
    signatureStore.startSigning('Please sign the transaction in your wallet.', options?.transactionDetails);
    
    // Sign the transaction
    const signedXDR = await currentWalletConnector.signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
      ...options,
    });
    
    // Stop signing state on success
    signatureStore.stopSigning();
    
    return signedXDR;
  } catch (error) {
    // Stop signing state on error
    const { useSignatureStore } = await import('../stores/signatureStore');
    const signatureStore = useSignatureStore.getState();
    signatureStore.stopSigning();
    
    throw error;
  }
}

export async function getNetwork(): Promise<string> {
  if (!currentWalletConnector) throw new Error("No wallet connector available.");
  return await currentWalletConnector.getNetwork();
}

export async function isWalletConnected(): Promise<boolean> {
  if (!currentWalletConnector) return false;
  return await currentWalletConnector.isConnected();
}

export { FREIGHTER_ID, XBULL_ID, ALBEDO_ID };
