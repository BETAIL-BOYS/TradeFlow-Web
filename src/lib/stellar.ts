import { isAllowed, setAllowed, getUserInfo } from "@stellar/freighter-api";
import { Server } from "soroban-client";

// Default to Testnet for development
const RPC_URL = "https://soroban-testnet.stellar.org";
const server = new Server(RPC_URL);

export async function connectWallet() {
  const allowed = await isAllowed();
  if (!allowed) {
    await setAllowed();
  }
  return await getUserInfo();
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
