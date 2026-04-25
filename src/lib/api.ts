import type {
  ApiResult,
  ApiStatusCode,
  GetRiskScoreParams,
  HealthResponse,
  InvoicesResponse,
  PnlResponse,
  RiskScoreResponse,
} from "../../types/api";
import {
  isHealthResponse,
  isInvoicesResponse,
  isPnlResponse,
  isRiskScoreResponse,
} from "../../types/api";
// Define types locally to avoid import path issues
type TransactionType = 'mint' | 'buy' | 'repay' | 'sell' | 'transfer';

interface TransactionRecord {
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

interface TransactionHistoryResponse {
  transactions: TransactionRecord[];
  total: number;
  page: number;
  limit: number;
}
import { httpClient, normalizeHttpError } from "./httpClient";

function toHeadersRecord(headers: any): Record<string, string> {
  const out: Record<string, string> = {};
  if (!headers) return out;
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) out[key] = value.join(", ");
    else if (typeof value === "string") out[key] = value;
    else if (typeof value === "number") out[key] = String(value);
    else if (typeof value === "boolean") out[key] = value ? "true" : "false";
  }
  return out;
}

function asStatusCode(status: number): ApiStatusCode {
  return status as ApiStatusCode;
}

function badRequest(message: string): ApiResult<never> {
  return { ok: false, status: 400, error: { message } };
}

function isSafeInvoiceId(invoiceId: string): boolean {
  if (!invoiceId) return false;
  if (invoiceId.length > 128) return false;
  return /^[a-zA-Z0-9._:-]+$/.test(invoiceId);
}

export interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * Fetches API health data from GET /health.
 *
 * @returns ApiResult<HealthResponse> with standardized success/error formatting.
 */
export async function getHealth(options: RequestOptions = {}): Promise<ApiResult<HealthResponse>> {
  try {
    const res = await httpClient.get("/health", { signal: options.signal });
    const data: unknown = res.data;

    if (!isHealthResponse(data)) {
      return {
        ok: false,
        status: asStatusCode(res.status),
        headers: toHeadersRecord(res.headers),
        error: { message: "Invalid /health response shape", details: data },
      };
    }

    return {
      ok: true,
      status: asStatusCode(res.status),
      headers: toHeadersRecord(res.headers),
      data,
    };
  } catch (error) {
    const normalized = normalizeHttpError(error);
    return { ok: false, ...normalized };
  }
}

/**
 * Fetches a risk score for a given invoice ID from GET /v1/risk?invoiceId=...
 *
 * @param invoiceId - The invoice identifier used by the backend risk engine.
 * @returns ApiResult<RiskScoreResponse> with standardized success/error formatting.
 */
export async function getRiskScore(
  invoiceId: GetRiskScoreParams["invoiceId"],
  options: RequestOptions = {},
): Promise<ApiResult<RiskScoreResponse>> {
  if (!isSafeInvoiceId(invoiceId)) {
    return badRequest("Invalid invoiceId. Expected 1-128 chars: letters, numbers, . _ : -");
  }

  try {
    const res = await httpClient.get("/v1/risk", {
      signal: options.signal,
      params: { invoiceId },
    });
    const data: unknown = res.data;

    if (!isRiskScoreResponse(data)) {
      return {
        ok: false,
        status: asStatusCode(res.status),
        headers: toHeadersRecord(res.headers),
        error: { message: "Invalid /v1/risk response shape", details: data },
      };
    }

    return {
      ok: true,
      status: asStatusCode(res.status),
      headers: toHeadersRecord(res.headers),
      data,
    };
  } catch (error) {
    const normalized = normalizeHttpError(error);
    return { ok: false, ...normalized };
  }
}

/**
 * Fetches invoice summaries from GET /invoices.
 *
 * @returns ApiResult<InvoicesResponse> with standardized success/error formatting.
 */
export async function getInvoices(options: RequestOptions = {}): Promise<ApiResult<InvoicesResponse>> {
  try {
    const res = await httpClient.get("/invoices", { signal: options.signal });
    const data: unknown = res.data;

    if (!isInvoicesResponse(data)) {
      return {
        ok: false,
        status: asStatusCode(res.status),
        headers: toHeadersRecord(res.headers),
        error: { message: "Invalid /invoices response shape", details: data },
      };
    }

    return {
      ok: true,
      status: asStatusCode(res.status),
      headers: toHeadersRecord(res.headers),
      data,
    };
  } catch (error) {
    const normalized = normalizeHttpError(error);
    return { ok: false, ...normalized };
  }
}

/**
 * Fetches profit-and-loss chart data from GET /api/pnl.
 *
 * @returns ApiResult<PnlResponse> with standardized success/error formatting.
 */
export async function getPnl(options: RequestOptions = {}): Promise<ApiResult<PnlResponse>> {
  try {
    const res = await httpClient.get("/api/pnl", { signal: options.signal });
    const data: unknown = res.data;

    if (!isPnlResponse(data)) {
      return {
        ok: false,
        status: asStatusCode(res.status),
        headers: toHeadersRecord(res.headers),
        error: { message: "Invalid /api/pnl response shape", details: data },
      };
    }

    return {
      ok: true,
      status: asStatusCode(res.status),
      headers: toHeadersRecord(res.headers),
      data,
    };
  } catch (error) {
    const normalized = normalizeHttpError(error);
    return { ok: false, ...normalized };
  }
}

/**
 * Fetches transaction history for a given Stellar public key from Horizon API.
 * 
 * @param publicKey - The Stellar public key to fetch transactions for
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of transactions per page (default: 20, max: 200)
 * @returns ApiResult<TransactionHistoryResponse> with transaction data
 */
export async function getTransactionHistory(
  publicKey: string,
  page: number = 1,
  limit: number = 20,
  options: RequestOptions = {}
): Promise<ApiResult<TransactionHistoryResponse>> {
  if (!publicKey || !/^[G][A-Za-z0-9]{55}$/.test(publicKey)) {
    return badRequest("Invalid Stellar public key format");
  }

  if (limit > 200) limit = 200;
  if (limit < 1) limit = 20;
  if (page < 1) page = 1;

  try {
    // Use Horizon API to fetch transactions for the account
    const horizonUrl = `https://horizon-testnet.stellar.org/accounts/${publicKey}/transactions`;
    const params = new URLSearchParams({
      limit: limit.toString(),
      order: 'desc',
      include_failed: 'true'
    });

    const response = await fetch(`${horizonUrl}?${params}`, {
      signal: options.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Horizon API error: ${response.status} ${response.statusText}`);
    }

    const horizonData = await response.json();
    
    // Transform Horizon transactions to our TransactionRecord format
    const transactions: TransactionRecord[] = horizonData._embedded.records.map((tx: any) => {
      const transactionType = determineTransactionType(tx);
      const timestamp = new Date(tx.created_at).toISOString();
      
      return {
        id: tx.id,
        hash: tx.hash,
        type: transactionType,
        timestamp,
        amount: extractAmount(tx),
        asset: extractAsset(tx),
        from: tx.source_account,
        to: extractToAddress(tx),
        status: tx.successful ? 'success' : 'failed',
        fee: tx.fee_paid ? (parseInt(tx.fee_paid) / 10000000).toString() : undefined,
        memo: tx.memo ? tx.memo : undefined,
        stellarExpertUrl: `https://stellar.expert/explorer/testnet/tx/${tx.hash}`
      };
    });

    const result: TransactionHistoryResponse = {
      transactions,
      total: horizonData._embedded.records.length,
      page,
      limit
    };

    return {
      ok: true,
      status: 200,
      headers: {},
      data: result
    };

  } catch (error) {
    const normalized = normalizeHttpError(error);
    return { ok: false, ...normalized };
  }
}

/**
 * Determines the transaction type based on Horizon transaction data
 */
function determineTransactionType(tx: any): 'mint' | 'buy' | 'repay' | 'sell' | 'transfer' {
  // This is a simplified determination logic
  // In a real implementation, you'd analyze the operations more thoroughly
  const operations = tx.operations || [];
  
  if (operations.length === 0) return 'transfer';
  
  const firstOp = operations[0];
  
  if (firstOp.type === 'payment') {
    // Check memo or other indicators for specific transaction types
    if (tx.memo && typeof tx.memo === 'string') {
      const memo = tx.memo.toLowerCase();
      if (memo.includes('mint')) return 'mint';
      if (memo.includes('repay')) return 'repay';
      if (memo.includes('buy')) return 'buy';
      if (memo.includes('sell')) return 'sell';
    }
    return 'transfer';
  }
  
  // Default to transfer for other operation types
  return 'transfer';
}

/**
 * Extracts amount from transaction operations
 */
function extractAmount(tx: any): string {
  const operations = tx.operations || [];
  const paymentOp = operations.find((op: any) => op.type === 'payment');
  
  if (paymentOp && paymentOp.amount) {
    return paymentOp.amount;
  }
  
  return '0';
}

/**
 * Extracts asset code from transaction operations
 */
function extractAsset(tx: any): string {
  const operations = tx.operations || [];
  const paymentOp = operations.find((op: any) => op.type === 'payment');
  
  if (paymentOp) {
    if (paymentOp.asset_code) {
      return paymentOp.asset_code;
    }
    if (paymentOp.asset_type === 'native') {
      return 'XLM';
    }
  }
  
  return 'Unknown';
}

/**
 * Extracts destination address from transaction operations
 */
function extractToAddress(tx: any): string | undefined {
  const operations = tx.operations || [];
  const paymentOp = operations.find((op: any) => op.type === 'payment');
  
  return paymentOp?.destination;
}

export const api = {
  getHealth,
  getRiskScore,
  getInvoices,
  getPnl,
  getTransactionHistory,
};
