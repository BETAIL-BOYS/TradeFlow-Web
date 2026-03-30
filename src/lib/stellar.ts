import { 
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  XBULL_ID,
  ALBEDO_ID,
  RABET_ID,
  LOBSTR_ID,
  HANA_ID
} from "@creit.tech/stellar-wallets-kit";
import {
  Server,
  TransactionBuilder,
  Asset,
  Operation,
  Networks,
} from "soroban-client";

// Re-export constants for backward compatibility if needed, 
// though we use the ones from the kit now.
export { FREIGHTER_ID, XBULL_ID, ALBEDO_ID };

// Define WalletType as string to match the kit's expected IDs
export type WalletType = string;

// Default to Testnet for development
const RPC_URL = "https://soroban-testnet.stellar.org";
const server = new Server(RPC_URL);
const NETWORK_PASSPHRASE = Networks.TESTNET;

// Initialize wallet kit instance (only in browser)
export const walletKit = typeof window !== "undefined" 
  ? new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      modules: allowAllModules(),
    })
  : null as unknown as StellarWalletsKit;

export interface WalletInfo {
  publicKey: string;
  walletType: WalletType;
}

/**
 * Connects to a Stellar wallet using the wallet kit.
 * Supports Freighter, Albedo, and xBull wallets.
 */
export async function connectWallet(walletType: WalletType = FREIGHTER_ID): Promise<WalletInfo> {
  if (!walletKit) throw new Error("Wallet kit is not available in this environment.");
  
  try {
    // Set the wallet type
    walletKit.setWallet(walletType);
    
    // Get public key / address
    const { address } = await walletKit.getAddress();
    
    if (!address) {
      throw new Error("Unable to retrieve public key.");
    }

    // Verify correct network (Testnet)
    const { network } = await walletKit.getNetwork();
    // The kit might return "TESTNET" or the passphrase
    if (network !== "TESTNET" && network !== WalletNetwork.TESTNET) {
      const walletName = getWalletName(walletType);
      throw new Error(
        `Invalid network. Please switch to TESTNET in ${walletName} settings.`,
      );
    }

    return { publicKey: address, walletType };
  } catch (error: any) {
    console.error("Wallet connection error:", error);
    throw error;
  }
}

/**
 * Gets the current connected wallet info
 * Note: The kit doesn't have a direct 'getWallet' that returns the ID easily without tracking it,
 * but we can at least try to get the address.
 */
export async function getConnectedWallet(): Promise<WalletInfo | null> {
  if (!walletKit) return null;
  
  try {
    const { address } = await walletKit.getAddress({ skipRequestAccess: true });
    if (!address) return null;
    
    // We don't easily know the walletType here unless we stored it.
    // Defaulting to FREIGHTER_ID or similar might be inaccurate.
    return { publicKey: address, walletType: FREIGHTER_ID }; 
  } catch (error) {
    return null;
  }
}

/**
 * Disconnects the current wallet
 */
export async function disconnectWallet(): Promise<void> {
  if (!walletKit) return;
  
  try {
    if (walletKit.disconnect) {
      await walletKit.disconnect();
    }
  } catch (error) {
    console.error("Wallet disconnection error:", error);
  }
}

/**
 * Gets the display name for a wallet type
 */
function getWalletName(walletType: WalletType): string {
  switch (walletType) {
    case FREIGHTER_ID:
      return "Freighter";
    case XBULL_ID:
      return "xBull";
    case ALBEDO_ID:
      return "Albedo";
    case RABET_ID:
      return "Rabet";
    case LOBSTR_ID:
      return "Lobstr";
    case HANA_ID:
      return "Hana";
    default:
      return "Wallet";
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
  const TIMEOUT_MS = 30000;
  const POLLING_INTERVAL_MS = 2000;
  const startTime = Date.now();

  console.log(
    `[waitForTransaction] Starting monitoring for transaction: ${hash}`,
  );

  while (Date.now() - startTime < TIMEOUT_MS) {
    try {
      // Attempt to fetch transaction status
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

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
  }

  // Timeout reached
  const errorMsg = `Transaction monitoring timed out after ${TIMEOUT_MS / 1000}s for hash: ${hash}`;
  console.error(`[waitForTransaction] ${errorMsg}`);
  throw new Error(errorMsg);
}

/**
 * Adds a trustline for a Stellar asset (ChangeTrust operation).
 * @param assetCode - Code of the asset (e.g., "USDC")
 * @param assetIssuer - Issuer address of the asset
 * @param walletType - Optional wallet type override
 */
export async function addTrustline(assetCode: string, assetIssuer: string, walletType?: WalletType) {
  if (!walletKit) throw new Error("Wallet kit is not available in this environment.");

  // If walletType is provided, set it temporarily
  if (walletType) {
    kit.setWallet(walletType);
  }
  
  const { address: publicKey } = await walletKit.getAddress();
  
  // Fetch account details to get the current sequence number
  const account = await server.getAccount(publicKey);
  const asset = new Asset(assetCode, assetIssuer);

  const transaction = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.changeTrust({ asset }))
    .setTimeout(60)
    .build();

  const xdr = transaction.toXDR();
  const { signedTxXdr } = await walletKit.signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  const response = await server.sendTransaction(transaction);

  if (response.hash) {
    return await waitForTransaction(response.hash);
  }

  throw new Error("Transaction failed during submission.");
}

/**
 * Signs a transaction using the currently connected wallet
 */
export async function signTransaction(
  xdr: string,
  options?: any,
): Promise<string> {
  const { address: publicKey } = await kit.getAddress();
  const { signedTxXdr } = await kit.signTransaction(xdr, {
    address: publicKey,
    networkPassphrase: NETWORK_PASSPHRASE,
    ...options,
  });
  return signedTxXdr;
}

export async function getNetwork(): Promise<string> {
  if (!walletKit) throw new Error("Wallet kit is not available in this environment.");

  const { network } = await walletKit.getNetwork();
  return network;
}

export async function isWalletConnected(): Promise<boolean> {
  if (!walletKit) return false;

  try {
    const { address } = await walletKit.getAddress({ skipRequestAccess: true });
    return !!address;
  } catch {
    return false;
  }
}

export { kit as walletKit, FREIGHTER_ID, XBULL_ID, ALBEDO_ID };
