'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { clearWalletCache } from '../lib/walletCache';
import { clearAuthToken } from '../lib/httpClient';
import { useWeb3Store } from '../stores/useWeb3Store';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const DEBOUNCE_MS = 500;

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] as const;

export function useSessionTimeout() {
  const [isExpired, setIsExpired] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isConnected = useWeb3Store((state) => state.isConnected);
  const disconnectWallet = useWeb3Store((state) => state.disconnectWallet);

  const clearSession = useCallback(() => {
    clearWalletCache();
    clearAuthToken();
    disconnectWallet();
    setIsExpired(true);
  }, [disconnectWallet]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(clearSession, INACTIVITY_TIMEOUT_MS);
  }, [clearSession]);

  const handleActivity = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(resetTimer, DEBOUNCE_MS);
  }, [resetTimer]);

  const dismissExpiry = useCallback(() => {
    setIsExpired(false);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    resetTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isConnected, handleActivity, resetTimer]);

  return { isExpired, dismissExpiry };
}
