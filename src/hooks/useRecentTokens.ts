/**
 * Recent Tokens Hook.
 * Manages a persistent list of recently used tokens (symbols) in the swap interface.
 * Helps improve UX by providing quick access to common assets.
 */

import { useState, useEffect, useCallback } from 'react';

/** localStorage key for recent token symbols */
const STORAGE_KEY = 'tradeflow_recent_tokens';
/** Maximum number of unique tokens to track */
const MAX_RECENT_TOKENS = 3;

/**
 * Custom hook for managing the recent tokens list.
 */
export function useRecentTokens() {
  // --- State Initialization ---
  const [recentTokens, setRecentTokens] = useState<string[]>([]);

  /**
   * Effect: Hydrate the state from localStorage on component mount.
   * Only runs in the browser environment.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed)) {
          // Validate that the array contains only strings
          const validTokens = parsed.filter(t => typeof t === 'string');
          setRecentTokens(validTokens);
        }
      }
    } catch (error) {
      console.warn('[useRecentTokens] Error loading history:', error);
    }
  }, []);

  /**
   * Adds a token to the top of the recent list.
   * If the token already exists, it is moved to the front.
   * 
   * @param {string} tokenSymbol - The symbol of the token (e.g., "XLM").
   */
  const addRecentToken = useCallback((tokenSymbol: string) => {
    if (!tokenSymbol) return;

    setRecentTokens((prev) => {
      // 1. Remove duplicates to ensure uniqueness
      const filteredList = prev.filter((t) => t !== tokenSymbol);
      
      // 2. Prepend the new token and enforce the size limit
      const updatedHistory = [tokenSymbol, ...filteredList].slice(0, MAX_RECENT_TOKENS);
      
      // 3. Persist the updated list for future sessions
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.warn('[useRecentTokens] Failed to persist update:', error);
      }
      
      return updatedHistory;
    });
  }, []);

  /**
   * Resets the recent tokens history.
   */
  const clearHistory = useCallback(() => {
    setRecentTokens([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { 
    /** The current array of recently used token symbols */
    recentTokens, 
    /** Function to track a new token usage */
    addRecentToken,
    /** Function to wipe the history */
    clearHistory
  };
}
