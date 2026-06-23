'use client';

import { showError, showLoading, showSuccess } from './toast';

/**
 * Hook for displaying transaction-related toast notifications.
 * Provides convenience methods for loading, success, and error toasts.
 * @returns An object with loading, success, and error toast functions.
 */
export default function useTransactionToast() {
  const loading = (message = 'Waiting for confirmation...') => showLoading(message);
  const success = (message = 'Invoice Minted Successfully!') => showSuccess(message);
  const error = (message = 'Transaction Failed') => showError(message);

  return { loading, success, error };
}
