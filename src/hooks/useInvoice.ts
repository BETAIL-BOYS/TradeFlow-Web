import { useState, useEffect } from 'react';
import { getInvoice, type Invoice } from '@/soroban';

/**
 * Fetches a single invoice from the Soroban contract and exposes loading/error state.
 * Used by the invoice detail page to display on-chain data.
 * @param invoiceId - The on-chain invoice identifier.
 * @returns An object with the invoice data, loading state, and error.
 */
export function useInvoice(invoiceId: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!invoiceId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getInvoice(invoiceId)
      .then((data) => {
        if (!cancelled) setInvoice(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  return { invoice, loading, error };
}

// Maintenance: minor update
