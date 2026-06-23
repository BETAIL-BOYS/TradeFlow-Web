import type {
  ApiResult,
  ApiStatusCode,
  GetRiskScoreParams,
  HealthResponse,
  InvoicesResponse,
  PnlResponse,
  RiskScoreResponse,
} from '../../types/api';
import {
  isHealthResponse,
  isInvoicesResponse,
  isPnlResponse,
  isRiskScoreResponse,
} from '../../types/api';
import { httpClient, normalizeHttpError } from './httpClient';

/**
 * Converts Axios headers object to a plain Record<string, string>.
 * Handles arrays, numbers, and booleans by joining or stringifying.
 */
function toHeadersRecord(headers: any): Record<string, string> {
  const out: Record<string, string> = {};
  if (!headers) return out;
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) out[key] = value.join(', ');
    else if (typeof value === 'string') out[key] = value;
    else if (typeof value === 'number') out[key] = String(value);
    else if (typeof value === 'boolean') out[key] = value ? 'true' : 'false';
  }
  return out;
}

/**
 * Casts a numeric HTTP status to the ApiStatusCode branded type.
 */
function asStatusCode(status: number): ApiStatusCode {
  return status as ApiStatusCode;
}

/**
 * Returns a 400 ApiResult with the given error message.
 */
function badRequest(message: string): ApiResult<never> {
  return { ok: false, status: 400, error: { message } };
}

/**
 * Validates an invoice ID for safe use in URL parameters.
 * Rejects empty, overly long, or non-alphanumeric values.
 */
function isSafeInvoiceId(invoiceId: string): boolean {
  if (!invoiceId) return false;
  if (invoiceId.length > 128) return false;
  return /^[a-zA-Z0-9._:-]+$/.test(invoiceId);
}

/**
 * Optional request configuration passed to API functions.
 */
export interface RequestOptions {
  /** Optional AbortSignal to cancel the request */
  signal?: AbortSignal;
}

/**
 * Fetches API health data from GET /health.
 *
 * @returns ApiResult<HealthResponse> with standardized success/error formatting.
 */
export async function getHealth(options: RequestOptions = {}): Promise<ApiResult<HealthResponse>> {
  try {
    const res = await httpClient.get('/health', { signal: options.signal });
    const data: unknown = res.data;

    if (!isHealthResponse(data)) {
      return {
        ok: false,
        status: asStatusCode(res.status),
        headers: toHeadersRecord(res.headers),
        error: { message: 'Invalid /health response shape', details: data },
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
  invoiceId: GetRiskScoreParams['invoiceId'],
  options: RequestOptions = {}
): Promise<ApiResult<RiskScoreResponse>> {
  if (!isSafeInvoiceId(invoiceId)) {
    return badRequest('Invalid invoiceId. Expected 1-128 chars: letters, numbers, . _ : -');
  }

  try {
    const res = await httpClient.get('/v1/risk', {
      signal: options.signal,
      params: { invoiceId },
    });
    const data: unknown = res.data;

    if (!isRiskScoreResponse(data)) {
      return {
        ok: false,
        status: asStatusCode(res.status),
        headers: toHeadersRecord(res.headers),
        error: { message: 'Invalid /v1/risk response shape', details: data },
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
export async function getInvoices(
  options: RequestOptions = {}
): Promise<ApiResult<InvoicesResponse>> {
  try {
    const res = await httpClient.get('/api/invoices', { signal: options.signal });
    const data: unknown = res.data;

    if (!isInvoicesResponse(data)) {
      return {
        ok: false,
        status: asStatusCode(res.status),
        headers: toHeadersRecord(res.headers),
        error: { message: 'Invalid /invoices response shape', details: data },
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
    const res = await httpClient.get('/api/pnl', { signal: options.signal });
    const data: unknown = res.data;

    if (!isPnlResponse(data)) {
      return {
        ok: false,
        status: asStatusCode(res.status),
        headers: toHeadersRecord(res.headers),
        error: { message: 'Invalid /api/pnl response shape', details: data },
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

export const api = {
  getHealth,
  getRiskScore,
  getInvoices,
  getPnl,
};
