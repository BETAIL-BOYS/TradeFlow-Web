import { useState } from 'react';
import { repayInvoice } from '@/soroban';

/**
 * Hook for repaying an invoice via the Soroban smart contract.
 * Manages loading, error, and transaction status states.
 * @returns An object with the repay function, loading state, error, and txStatus.
 */
export function useRepayInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  /**
   * Executes the invoice repayment transaction.
   * @param invoiceId - The ID of the invoice to repay.
   * @param callerPublicKey - The Stellar public key of the caller.
   * @returns The transaction status string.
   */
  async function repay(invoiceId: string, callerPublicKey: string) {
    setLoading(true);
    setError(null);
    try {
      const status = await repayInvoice({ invoiceId, callerPublicKey });
      setTxStatus(status);
      return status;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { repay, loading, error, txStatus };
}

// Maintenance: minor update
