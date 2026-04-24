import { useState, useEffect } from 'react';

const WATCHLIST_STORAGE_KEY = 'tradeflow-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load watchlist from localStorage:', error);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.error('Failed to save watchlist to localStorage:', error);
    }
  }, [watchlist]);

  const addToWatchlist = (tokenSymbol: string) => {
    setWatchlist(prev => {
      if (prev.includes(tokenSymbol)) {
        return prev; // Already in watchlist
      }
      return [...prev, tokenSymbol];
    });
  };

  const removeFromWatchlist = (tokenSymbol: string) => {
    setWatchlist(prev => prev.filter(token => token !== tokenSymbol));
  };

  const toggleWatchlist = (tokenSymbol: string) => {
    if (watchlist.includes(tokenSymbol)) {
      removeFromWatchlist(tokenSymbol);
    } else {
      addToWatchlist(tokenSymbol);
    }
  };

  const isInWatchlist = (tokenSymbol: string) => {
    return watchlist.includes(tokenSymbol);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
  };
}
