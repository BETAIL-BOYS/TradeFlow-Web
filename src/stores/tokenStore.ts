/**
 * Token Management Store.
 * Handles tracking of the native TradeFlow (TF) utility token, 
 * including balances, pro-mode access levels, and connection status.
 */

import { create } from 'zustand';
import { Server, Asset } from 'soroban-client';

/**
 * TradeFlow Token (TF) Configuration.
 * These constants define the utility token used for premium features.
 */
const TF_TOKEN_CODE = 'TF';
const TF_TOKEN_ISSUER = 'GBBHPLX4LBHS5JPC4FBDHD4YDZSZJZG7VQMIY6RDZT6HRJ5QJ5N6KFGH'; // Example issuer address
const PRO_MODE_THRESHOLD = 1000; // Minimum TF tokens required for Pro Mode

/**
 * Representation of a Stellar asset balance.
 */
interface TokenBalance {
  /** The 1-12 character asset code */
  code: string;
  /** The public address of the asset issuer */
  issuer: string;
  /** The current balance as a string (to maintain precision) */
  balance: string;
}

/**
 * State and actions for the Token Store.
 */
interface TokenStore {
  /** Current balance of TF tokens for the connected user */
  tfTokenBalance: number;
  /** Whether a wallet is currently connected to the store */
  isConnected: boolean;
  /** The public address of the connected wallet */
  publicKey: string | null;
  /** Loading state for asynchronous balance fetching */
  isLoading: boolean;
  /** Error message if a balance fetch fails */
  error: string | null;
  
  /**
   * Fetches the TF token balance for a specific public key from the network.
   * @param {string} publicKey - The Stellar address to query.
   */
  fetchTokenBalance: (publicKey: string) => Promise<void>;
  
  /**
   * Updates the connection status and triggers a balance refresh if connecting.
   * @param {boolean} connected - The new connection state.
   * @param {string} [publicKey] - The address of the connecting wallet.
   */
  setConnected: (connected: boolean, publicKey?: string) => void;
  
  /**
   * Evaluates if the current user has enough TF tokens to access Pro Mode.
   * @returns {boolean} True if the threshold is met.
   */
  hasProModeAccess: () => boolean;
}

/**
 * Zustand store for managing TradeFlow token state.
 */
export const useTokenStore = create<TokenStore>((set, get) => ({
  // Initial state values
  tfTokenBalance: 0,
  isConnected: false,
  publicKey: null,
  isLoading: false,
  error: null,

  /**
   * Asynchronously retrieves the TF token balance from the Horizon server.
   */
  fetchTokenBalance: async (publicKey: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Connect to the Soroban Testnet Horizon server
      const server = new Server('https://soroban-testnet.stellar.org');
      
      try {
        // 1. Retrieve the account details
        const account = await server.getAccount(publicKey);
        const tfAsset = new Asset(TF_TOKEN_CODE, TF_TOKEN_ISSUER);
        
        // 2. Locate the TF token in the account's balances array
        const tfBalance = account.balances.find((balance: any) => 
          balance.asset_code === TF_TOKEN_CODE && 
          balance.asset_issuer === TF_TOKEN_ISSUER
        );
        
        // 3. Parse and update the balance state
        const balance = tfBalance ? parseFloat(tfBalance.balance) : 0;
        
        set({ 
          tfTokenBalance: balance,
          isLoading: false 
        });
      } catch (error) {
        // Fallback: If account is not found or has no trustline, balance is 0
        set({ 
          tfTokenBalance: 0,
          isLoading: false,
          error: 'Unable to fetch token balance'
        });
      }
    } catch (error) {
      console.error('[TokenStore] Critical error fetching balance:', error);
      set({ 
        tfTokenBalance: 0,
        isLoading: false,
        error: 'Failed to connect to network'
      });
    }
  },

  /**
   * Updates the global connection state and manages balance refresh.
   */
  setConnected: (connected: boolean, publicKey?: string) => {
    set({ 
      isConnected: connected,
      publicKey: publicKey || null,
      error: null
    });
    
    // Auto-fetch balance on successful connection
    if (connected && publicKey) {
      get().fetchTokenBalance(publicKey);
    } else {
      // Clear balance on disconnect
      set({ tfTokenBalance: 0 });
    }
  },

  /**
   * Logic for determining premium access.
   */
  hasProModeAccess: () => {
    const { tfTokenBalance, isConnected } = get();
    return isConnected && tfTokenBalance >= PRO_MODE_THRESHOLD;
  }
}));

/**
 * Re-export constants for use in UI components.
 */
export const PRO_MODE_THRESHOLD_AMOUNT = PRO_MODE_THRESHOLD;
export const TF_TOKEN_INFO = {
  code: TF_TOKEN_CODE,
  issuer: TF_TOKEN_ISSUER,
  name: 'TradeFlow Token',
  description: 'Utility token for the TradeFlow ecosystem.',
  symbol: 'TF'
};

