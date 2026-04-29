/**
 * Watchlist Management Hook.
 * Handles the persistence and state of a user's token watchlist 
 * using browser localStorage.
 */

import { useState, useEffect } from 'react';

/** Key used for persisting watchlist data in localStorage */
const WATCHLIST_STORAGE_KEY = 'tradeflow-watchlist';

/**
 * Custom hook for interacting with the token watchlist.
 * 
 * @returns {object} An object containing the watchlist state and management functions.
 */
export function useWatchlist() {
  // --- State Initialization ---
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // --- Persistence Logic ---

  /**
   * Effect: Load the watchlist from localStorage on component mount.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        // Attempt to parse the stored JSON array
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchlist(parsed);
        }
      }
    } catch (error) {
      console.error('[useWatchlist] Failed to load watchlist from localStorage:', error);
    }
  }, []);

  /**
   * Effect: Persist the watchlist to localStorage whenever it changes.
   */
  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.error('[useWatchlist] Failed to save watchlist to localStorage:', error);
    }
  }, [watchlist]);

  // --- Action Handlers ---

  /**
   * Adds a token symbol to the user's watchlist.
   * @param {string} tokenSymbol - The symbol of the token (e.g., "XLM").
   */
  const addToWatchlist = (tokenSymbol: string) => {
    setWatchlist(prev => {
      if (prev.includes(tokenSymbol)) {
        return prev; // No-op if already present
      }
      return [...prev, tokenSymbol];
    });
  };

  /**
   * Removes a token symbol from the user's watchlist.
   * @param {string} tokenSymbol - The symbol of the token to remove.
   */
  const removeFromWatchlist = (tokenSymbol: string) => {
    setWatchlist(prev => prev.filter(token => token !== tokenSymbol));
  };

  /**
   * Toggles the presence of a token symbol in the watchlist.
   * @param {string} tokenSymbol - The symbol to toggle.
   */
  const toggleWatchlist = (tokenSymbol: string) => {
    if (watchlist.includes(tokenSymbol)) {
      removeFromWatchlist(tokenSymbol);
    } else {
      addToWatchlist(tokenSymbol);
    }
  };

  /**
   * Checks if a specific token symbol is currently in the watchlist.
   * @param {string} tokenSymbol - The symbol to check.
   * @returns {boolean} True if the token is watched.
   */
  const isInWatchlist = (tokenSymbol: string) => {
    return watchlist.includes(tokenSymbol);
  };

  return {
    /** The current list of watched token symbols */
    watchlist,
    /** Function to add a token */
    addToWatchlist,
    /** Function to remove a token */
    removeFromWatchlist,
    /** Function to toggle a token */
    toggleWatchlist,
    /** Function to check if a token is watched */
    isInWatchlist,
  };
}

<<<<<<< HEAD
=======
// Maintenance: minor update
>>>>>>> upstream/main
