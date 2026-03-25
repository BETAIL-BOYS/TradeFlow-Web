import { 
  requestAccess, 
  getPublicKey, 
  isConnected,
  getNetwork,
  signTransaction 
} from "@stellar/freighter-api";
import { 
  Server, 
  TransactionBuilder, 
  Asset, 
  Operation, 
  Networks 
} from "soroban-client";

// Default to Testnet for development
const RPC_URL = "https://soroban-testnet.stellar.org";
const server = new Server(RPC_URL);

const NETWORK_PASSPHRASE = Networks.TESTNET;

/**
 * Connects to the Freighter wallet extension.
 * 1. Checks if Freighter is installed and connected.
 * 2. Requests access to the user's account.
 * 3. Retrieves the public key (Stellar address).
 */
export async function connectWallet() {
  if (!await isConnected()) {
    throw new Error("Freighter extension not found. Please install it to continue.");
  }

  try {
    // requestAccess() prompts the user to authorize the app
    const accessResponse = await requestAccess();
    
    if (!accessResponse) {
      throw new Error("Access denied by user.");
    }

    // After access is granted, we fetch the public key (Stellar address)
    const publicKey = await getPublicKey();
    
    if (!publicKey) {
      throw new Error("Unable to retrieve public key.");
    }

    // Verify correct network (Testnet)
    const network = await getNetwork();
    if (network !== "TESTNET") {
      throw new Error(`Invalid network: ${network}. Please switch to TESTNET in Freighter settings.`);
    }

    return { publicKey };
  } catch (error: any) {
    console.error("Wallet connection error:", error);
    throw error;
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

  console.log(`[waitForTransaction] Starting monitoring for transaction: ${hash}`);

  while (Date.now() - startTime < TIMEOUT_MS) {
    try {
      // Attempt to fetch transaction status
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
      // Log error but continue polling (common for 404 Not Found initially)
      console.warn(`[waitForTransaction] Polling attempt failed (retrying): ${error.message}`);
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
 */
export async function addTrustline(assetCode: string, assetIssuer: string) {
  const { publicKey } = await connectWallet();
  
  // Fetch account details to get the current sequence number
  const account = await server.getAccount(publicKey);
  const asset = new Asset(assetCode, assetIssuer);
  
  // Construct the transaction
  const transaction = new TransactionBuilder(account, {
    fee: "1000", // Standard fee in stroops
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.changeTrust({ asset }))
    .setTimeout(60)
    .build();

  // Request signature from Freighter
  const xdr = transaction.toXDR();
  const signedXdr = await signTransaction(xdr, {
    network: "TESTNET",
  });

  // Submit to the network
  const response = await server.sendTransaction(transaction);
  
  if (response.hash) {
    return await waitForTransaction(response.hash);
  }
  
  throw new Error("Transaction failed during submission.");
}
