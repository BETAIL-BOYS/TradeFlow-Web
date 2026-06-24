import { useState } from 'react';
import { mintInvoice, type MintInvoiceParams } from '@/soroban';

/**
 * Hook for minting a new invoice via the Soroban smart contract.
 * Manages loading, error, and transaction status states.
 * @returns An object with the mint function, loading state, error, and txStatus.
 */
export function useMintInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  /**
   * Executes the invoice minting transaction.
   * @param params - The parameters for minting the invoice.
   * @returns The transaction status string.
   */
  async function mint(params: MintInvoiceParams) {
    setLoading(true);
    setError(null);
    try {
      const status = await mintInvoice(params);
      setTxStatus(status);
      return status;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { mint, loading, error, txStatus };
}

// Maintenance: minor update
