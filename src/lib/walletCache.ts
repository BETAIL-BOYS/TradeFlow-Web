// Wallet connection cache utilities to prevent UI flicker on page refresh

export interface WalletConnectionCache {
  walletAddress: string | null;
  walletType: string | null;
  isConnected: boolean;
  network: string;
  timestamp: number;
  // Add a version for future migrations
  version: number;
}

export interface WalletConnectionState {
  walletAddress: string | null;
  walletType: string | null;
  isConnected: boolean;
  network: string;
  isCached: boolean;
  needsRevalidation: boolean;
}

const CACHE_KEY = 'tradeflow_wallet_connection';
const CACHE_VERSION = 1;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const REVALIDATION_TTL = 30 * 1000; // 30 seconds before revalidation is needed

/**
 * Synchronously read wallet connection state from localStorage
 * This should be called before React paints to prevent UI flicker
 */
export function getCachedWalletConnection(): WalletConnectionState {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return {
      walletAddress: null,
      walletType: null,
      isConnected: false,
      network: 'Testnet',
      isCached: false,
      needsRevalidation: false,
    };
  }

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return {
        walletAddress: null,
        walletType: null,
        isConnected: false,
        network: 'Testnet',
        isCached: false,
        needsRevalidation: false,
      };
    }

    const cache: WalletConnectionCache = JSON.parse(cached);

    // Check version compatibility
    if (cache.version !== CACHE_VERSION) {
      clearWalletCache();
      return {
        walletAddress: null,
        walletType: null,
        isConnected: false,
        network: 'Testnet',
        isCached: false,
        needsRevalidation: false,
      };
    }

    // Check if cache is expired
    const now = Date.now();
    const isExpired = now - cache.timestamp > CACHE_TTL;
    const needsRevalidation = now - cache.timestamp > REVALIDATION_TTL;

    if (isExpired) {
      clearWalletCache();
      return {
        walletAddress: null,
        walletType: null,
        isConnected: false,
        network: 'Testnet',
        isCached: false,
        needsRevalidation: false,
      };
    }

    return {
      walletAddress: cache.walletAddress,
      walletType: cache.walletType,
      isConnected: cache.isConnected,
      network: cache.network,
      isCached: true,
      needsRevalidation,
    };
  } catch (error) {
    console.warn('Failed to read wallet cache:', error);
    clearWalletCache();
    return {
      walletAddress: null,
      walletType: null,
      isConnected: false,
      network: 'Testnet',
      isCached: false,
      needsRevalidation: false,
    };
  }
}

/**
 * Persists wallet connection state to localStorage for cache across page refreshes.
 * @param walletAddress - The connected wallet's public key.
 * @param walletType - The wallet provider type.
 * @param isConnected - Whether the wallet is connected.
 * @param network - The Stellar network identifier.
 */
export function setWalletConnectionCache(
  walletAddress: string | null,
  walletType: string | null,
  isConnected: boolean,
  network: string = 'Testnet'
): void {
  if (typeof window === 'undefined') return;

  try {
    const cache: WalletConnectionCache = {
      walletAddress,
      walletType,
      isConnected,
      network,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save wallet cache:', error);
  }
}

/**
 * Clears the wallet connection cache from localStorage.
 */
export function clearWalletCache(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear wallet cache:', error);
  }
}

/**
 * Checks whether the cached wallet connection needs revalidation (TTL exceeded).
 * @returns True if the cache is stale and should be revalidated.
 */
export function needsRevalidation(): boolean {
  const cached = getCachedWalletConnection();
  return cached.isCached && cached.needsRevalidation;
}

/**
 * Updates the cache timestamp to extend its TTL.
 * Useful after a successful revalidation.
 */
export function updateCacheTimestamp(): void {
  if (typeof window === 'undefined') return;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return;

    const cache: WalletConnectionCache = JSON.parse(cached);
    cache.timestamp = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to update cache timestamp:', error);
  }
}

/**
 * Returns the age of the wallet connection cache in milliseconds.
 * @returns The cache age in ms, or 0 if no cache exists.
 */
export function getCacheAge(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return 0;

    const cache: WalletConnectionCache = JSON.parse(cached);
    return Date.now() - cache.timestamp;
  } catch (error) {
    return 0;
  }
}
