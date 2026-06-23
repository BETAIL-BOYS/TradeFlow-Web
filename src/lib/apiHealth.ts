import { useBackendHealth } from '../contexts/BackendHealthContext';

// Error codes that indicate backend issues
export const BACKEND_ERROR_CODES = [500, 502, 503, 504];
export const NETWORK_ERROR_CODES = ['NETWORK_ERROR', 'TIMEOUT', 'CONNECTION_ERROR'];

export interface ApiCallOptions {
  endpoint?: string;
  skipHealthCheck?: boolean;
}

/**
 * Enhanced fetch wrapper that monitors backend health.
 * Checks response status against backend error codes and throws on issues.
 * @param url - The URL to fetch.
 * @param options - Standard fetch options.
 * @param healthOptions - Health monitoring configuration.
 * @returns The fetch Response.
 * @throws Error if the backend returns an error status code.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
  healthOptions: ApiCallOptions = {}
): Promise<Response> {
  const { endpoint = url, skipHealthCheck = false } = healthOptions;

  try {
    const response = await fetch(url, options);

    if (!skipHealthCheck) {
      // Check for backend error status codes
      if (BACKEND_ERROR_CODES.includes(response.status)) {
        const errorText = await response.text();
        throw new Error(`Backend error ${response.status}: ${errorText}`);
      }
    }

    return response;
  } catch (error) {
    if (!skipHealthCheck) {
      // Re-throw the error for the caller to handle
      throw error;
    }
    throw error;
  }
}

/**
 * Hook for making API calls with automatic health monitoring.
 * Reports success/failure to the BackendHealthContext.
 * @returns An object with the monitoredFetch function.
 */
export function useApiHealth() {
  const { reportError, reportSuccess } = useBackendHealth();

  const monitoredFetch = async (
    url: string,
    options: RequestInit = {},
    healthOptions: ApiCallOptions = {}
  ): Promise<Response> => {
    const { endpoint = url, skipHealthCheck = false } = healthOptions;

    try {
      const response = await apiFetch(url, options, { ...healthOptions, skipHealthCheck: true });

      if (!skipHealthCheck) {
        reportSuccess(endpoint);
      }

      return response;
    } catch (error) {
      if (!skipHealthCheck) {
        reportError(error as Error, endpoint);
      }
      throw error;
    }
  };

  return { monitoredFetch };
}

/**
 * Checks if an error indicates a backend health issue (HTTP 5xx or network error).
 * @param error - The error to inspect.
 * @returns True if the error is a backend health issue.
 */
export function isBackendHealthError(error: Error): boolean {
  const message = error.message.toLowerCase();

  // Check for HTTP error codes
  const httpCodeMatch = message.match(/error (500|502|503|504)/);
  if (httpCodeMatch) return true;

  // Check for network-related errors
  const networkErrors = [
    'network error',
    'connection error',
    'timeout',
    'fetch error',
    'failed to fetch',
    'connection refused',
    'service unavailable',
  ];

  return networkErrors.some((networkError) => message.includes(networkError));
}

/**
 * Creates a React Query error handler that reports backend health issues.
 * @param reportError - Function to report errors to the health context.
 * @returns A function suitable for use as onError in React Query hooks.
 */
export function createQueryErrorHandler(reportError: (error: Error, endpoint?: string) => void) {
  return (error: Error, query: any) => {
    const endpoint = (query.queryKey?.[0] as string) || 'unknown';

    if (isBackendHealthError(error)) {
      reportError(error, endpoint);
    }
  };
}
