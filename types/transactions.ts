export type TransactionType = 'mint' | 'buy' | 'repay' | 'sell' | 'transfer';

export interface TransactionRecord {
  id: string;
  hash: string;
  type: TransactionType;
  timestamp: string;
  amount: string;
  asset: string;
  from?: string;
  to?: string;
  status: 'success' | 'failed' | 'pending';
  fee?: string;
  memo?: string;
  stellarExpertUrl?: string;
}

export interface TransactionHistoryResponse {
  transactions: TransactionRecord[];
  total: number;
  page: number;
  limit: number;
}

export function isTransactionRecord(value: unknown): value is TransactionRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  
  return (
    typeof record.id === 'string' &&
    typeof record.hash === 'string' &&
    ['mint', 'buy', 'repay', 'sell', 'transfer'].includes(record.type as string) &&
    typeof record.timestamp === 'string' &&
    typeof record.amount === 'string' &&
    typeof record.asset === 'string' &&
    ['success', 'failed', 'pending'].includes(record.status as string)
  );
}

export function isTransactionHistoryResponse(value: unknown): value is TransactionHistoryResponse {
  if (!value || typeof value !== 'object') return false;
  const response = value as Record<string, unknown>;
  
  return (
    Array.isArray(response.transactions) &&
    response.transactions.every(isTransactionRecord) &&
    typeof response.total === 'number' &&
    typeof response.page === 'number' &&
    typeof response.limit === 'number'
  );
}
