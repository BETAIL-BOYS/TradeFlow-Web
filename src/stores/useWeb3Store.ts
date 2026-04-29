/**
 * Web3 State Management Store.
 * Centralizes wallet connection, network status, and account balances
 * using Zustand for reactive state updates across the application.
 */

import { create } from 'zustand';
import { Server, Asset } from 'soroban-client';
import { walletKit, FREIGHTER_ID, WalletType } from '../lib/stellar';

/**
 * Supported Stellar Networks.
 */
export const NETWORKS = {
  /** Public Stellar Testnet (Used for development and QA) */
  TESTNET: 'Testnet',
  /** Public Stellar Mainnet (Used for production assets) */
  MAINNET: 'Mainnet'
} as const;


export type NetworkType = typeof NETWORKS[keyof typeof NETWORKS];

// Stellar network endpoints
const NETWORK_ENDPOINTS = {
  [NETWORKS.TESTNET]: 'https://soroban-testnet.stellar.org',
  [NETWORKS.MAINNET]: 'https://horizon.stellar.org'
};

/**
 * Internal state for the Web3 store.
 */
interface Web3State {
  /** The public address of the connected wallet, or null if disconnected */
  walletAddress: string | null;
  /** The ID of the connected wallet provider (e.g., freighter) */
  walletType: WalletType | null;
  /** True if a wallet is successfully connected and reachable */
  isConnected: boolean;
  /** True during the asynchronous wallet connection process */
  isConnecting: boolean;
  
  /** The currently selected network (defaults to TESTNET) */
  network: NetworkType;
  
  /** Dictionary of asset balances, keyed by asset code (e.g., { "XLM": 50.5 }) */
  balances: Record<string, number>;
  
  /** Global loading state for network-bound operations */
  isLoading: boolean;
  /** Stores the last encountered error message, if any */
  error: string | null;
}


/**
 * Available actions for interacting with the Web3 store.
 */
interface Web3Actions {
  /**
   * Initiates a connection request to a Stellar wallet.
   * @param {WalletType} [walletType] - The specific wallet provider to use.
   */
  connectWallet: (walletType?: WalletType) => Promise<void>;
  
  /**
   * Clears the current wallet session and resets relevant state.
   */
  disconnectWallet: () => void;
  
  /**
   * Updates the store to point to a different Stellar network.
   * @param {NetworkType} network - The target network to switch to.
   */
  switchNetwork: (network: NetworkType) => Promise<void>;
  
  /**
   * Fetches the latest balances for all assets held by the connected account.
   */
  updateBalances: () => Promise<void>;
  
  /**
   * Manually updates the balance for a specific token in the store.
   * @param {string} tokenCode - The code of the asset.
   * @param {number} balance - The new numeric balance.
   */
  updateTokenBalance: (tokenCode: string, balance: number) => void;
  
  /**
   * Resets the error state in the store.
   */
  clearError: () => void;
  
  /**
   * Manually toggles the global loading state.
   * @param {boolean} loading - The new loading state.
   */
  setLoading: (loading: boolean) => void;
}


type Web3Store = Web3State & Web3Actions;

export const useWeb3Store = create<Web3Store>((set, get) => ({
  // Initial state
  walletAddress: null,
  walletType: null,
  isConnected: false,
  isConnecting: false,
  network: NETWORKS.TESTNET,
  balances: {},
  isLoading: false,
  error: null,

  // Connect wallet using wallet kit
  connectWallet: async (walletType: WalletType = FREIGHTER_ID) => {
    const { isConnected } = get();
    
    if (isConnected) {
      set({ error: 'Wallet is already connected' });
      return;
    }

    set({ isConnecting: true, error: null });

    try {
      // Set the wallet type
      walletKit.setWallet(walletType);
      
      // Check if wallet is available
      const isWalletAvailable = await walletKit.isWalletAvailable();
      
      if (!isWalletAvailable) {
        const walletName = getWalletName(walletType);
        throw new Error(`${walletName} is not available. Please install it to continue.`);
      }

      // Get public key
      const publicKey = await walletKit.getPublicKey();
      
      if (!publicKey) {
        throw new Error('Unable to retrieve public key.');
      }

      // Verify correct network (Testnet)
      const network = await walletKit.getNetwork();
      if (network !== "TESTNET") {
        const walletName = getWalletName(walletType);
        throw new Error(`Invalid network: ${network}. Please switch to TESTNET in ${walletName} settings.`);
      }

      // Update state with connected wallet
      set({
        walletAddress: publicKey,
        walletType,
        isConnected: true,
        isConnecting: false,
        error: null
      });

      // Fetch initial balances
      await get().updateBalances();

    } catch (error) {
      console.error('Wallet connection error:', error);
      set({
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      });
    }
  },

  // Disconnect wallet
  disconnectWallet: async () => {
    try {
      await walletKit.disconnect();
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
    
    set({
      walletAddress: null,
      walletType: null,
      isConnected: false,
      isConnecting: false,
      balances: {},
      error: null
    });
  },

  // Switch network
  switchNetwork: async (network: NetworkType) => {
    const { isConnected, network: currentNetwork } = get();
    
    if (currentNetwork === network) {
      return; // Already on this network
    }

    set({ isLoading: true, error: null });

    try {
      // In a real implementation, you might need to disconnect and reconnect
      // or prompt the user to switch networks in their wallet
      set({ 
        network, 
        isLoading: false,
        balances: {} // Clear balances when switching networks
      });

      // If wallet is connected, fetch balances for new network
      if (isConnected) {
        await get().updateBalances();
      }

    } catch (error) {
      console.error('Network switch error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to switch network'
      });
    }
  },

  // Update all token balances
  updateBalances: async () => {
    const { walletAddress, network } = get();
    
    if (!walletAddress) {
      set({ error: 'No wallet connected' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const server = new Server(NETWORK_ENDPOINTS[network]);
      const account = await server.getAccount(walletAddress);
      
      const newBalances: Record<string, number> = {};
      
      // Process native XLM balance
      const xlmBalance = account.balances.find((balance: any) => balance.asset_type === 'native');
      if (xlmBalance) {
        newBalances['XLM'] = parseFloat(xlmBalance.balance);
      }

      // Process other token balances
      account.balances.forEach((balance: any) => {
        if (balance.asset_type !== 'native' && balance.asset_code) {
          newBalances[balance.asset_code] = parseFloat(balance.balance);
        }
      });

      set({
        balances: newBalances,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Balance update error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update balances'
      });
    }
  },

  // Update specific token balance
  updateTokenBalance: (tokenCode: string, balance: number) => {
    set(state => ({
      balances: {
        ...state.balances,
        [tokenCode]: balance
      }
    }));
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
}));

// Helper function to get wallet display name
function getWalletName(walletType: WalletType): string {
  switch (walletType) {
    case FREIGHTER_ID:
      return "Freighter";
    case 'xbull':
      return "xBull";
    case 'albedo':
      return "Albedo";
    default:
      return "Wallet";
  }
}

// Selectors for common use cases
export const useWalletConnection = () => {
  const { isConnected, walletAddress, walletType, isConnecting, connectWallet, disconnectWallet, error } = useWeb3Store();
  return { isConnected, walletAddress, walletType, isConnecting, connectWallet, disconnectWallet, error };
};

export const useNetwork = () => {
  const { network, switchNetwork } = useWeb3Store();
  return { network, switchNetwork };
};

export const useBalances = () => {
  const { balances, updateBalances, isLoading, error } = useWeb3Store();
  return { balances, updateBalances, isLoading, error };
};

// Helper function to get balance for a specific token
export const useTokenBalance = (tokenCode: string) => {
  const balances = useWeb3Store(state => state.balances);
  return balances[tokenCode] || 0;
};
