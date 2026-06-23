import { NetworkType } from '../stores/useWeb3Store';

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
  contractIds: {
    invoice: string;
  };
}

export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  Testnet: {
    name: 'Testnet',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractIds: {
      invoice: process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID_TESTNET || '',
    },
  },
  Mainnet: {
    name: 'Mainnet',
    rpcUrl: 'https://soroban.stellar.org',
    horizonUrl: 'https://horizon.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    contractIds: {
      invoice: process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID_MAINNET || '',
    },
  },
};

/**
 * Returns the full network configuration for the given network type.
 * @param network - The network type.
 * @returns The NetworkConfig object.
 */
export function getNetworkConfig(network: NetworkType): NetworkConfig {
  return NETWORK_CONFIGS[network];
}

/**
 * Returns whether the app is running in development mode.
 * @returns True if NODE_ENV is not 'production'.
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production';
}

// Local storage key for network override
const NETWORK_OVERRIDE_KEY = 'tradeflow_network_override';

/**
 * Reads a network override from localStorage (development only).
 * @returns The overridden network type, or null.
 */
export function getNetworkOverride(): NetworkType | null {
  if (typeof window === 'undefined' || !isDevelopment()) return null;

  try {
    const override = localStorage.getItem(NETWORK_OVERRIDE_KEY);
    return (override as NetworkType) || null;
  } catch (error) {
    console.warn('Failed to read network override:', error);
    return null;
  }
}

/**
 * Persists a network override to localStorage (development only).
 * @param network - The network type to set as override.
 */
export function setNetworkOverride(network: NetworkType): void {
  if (typeof window === 'undefined' || !isDevelopment()) return;

  try {
    localStorage.setItem(NETWORK_OVERRIDE_KEY, network);
  } catch (error) {
    console.warn('Failed to save network override:', error);
  }
}

/**
 * Removes the network override from localStorage.
 */
export function clearNetworkOverride(): void {
  if (typeof window === 'undefined' || !isDevelopment()) return;

  try {
    localStorage.removeItem(NETWORK_OVERRIDE_KEY);
  } catch (error) {
    console.warn('Failed to clear network override:', error);
  }
}

/**
 * Returns the effective network, preferring a stored override over the default.
 * @param defaultNetwork - The fallback network type.
 * @returns The resolved network type.
 */
export function getEffectiveNetwork(defaultNetwork: NetworkType = 'Testnet'): NetworkType {
  return getNetworkOverride() || defaultNetwork;
}
