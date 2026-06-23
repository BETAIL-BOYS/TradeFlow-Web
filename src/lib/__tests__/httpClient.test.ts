import { createHttpClient, normalizeHttpError } from '../httpClient';
import axios from 'axios';

jest.mock('../env', () => ({
  getApiBaseUrl: () => 'http://localhost:3001',
}));

function mockAdapter(client: ReturnType<typeof createHttpClient>) {
  let capturedHeaders: Record<string, string> = {};
  client.defaults.adapter = async (config: any) => {
    capturedHeaders = Object.fromEntries(
      Object.entries((config.headers as Record<string, unknown>) ?? {})
        .filter(([, v]) => typeof v === 'string')
        .map(([k, v]) => [k, v as string])
    );
    return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
  };
  return () => capturedHeaders;
}

describe('createHttpClient', () => {
  test('sets withCredentials: true so HttpOnly cookies are sent automatically', () => {
    const client = createHttpClient();
    expect((client.defaults as any).withCredentials).toBe(true);
  });

  test('uses the provided baseURL override', () => {
    const client = createHttpClient({ baseURL: 'http://custom-api.test' });
    expect(client.defaults.baseURL).toBe('http://custom-api.test');
  });

  test('uses the provided timeout override', () => {
    const client = createHttpClient({ timeoutMs: 5000 });
    expect(client.defaults.timeout).toBe(5000);
  });

  test('sets X-Requested-With header via interceptor', async () => {
    const client = createHttpClient();
    const getHeaders = mockAdapter(client);

    await client.get('/test');

    expect(getHeaders()['X-Requested-With']).toBe('XMLHttpRequest');
  });

  test('does not set an Authorization header', async () => {
    const client = createHttpClient();
    const getHeaders = mockAdapter(client);

    await client.get('/test');

    expect(getHeaders()['Authorization']).toBeUndefined();
  });
});

describe('normalizeHttpError', () => {
  test('returns unknown error message for non-Axios errors', () => {
    const result = normalizeHttpError(new Error('boom'));
    expect(result.error.message).toBe('boom');
    expect(result.status).toBeUndefined();
  });

  test('extracts status and message from Axios errors', () => {
    const axiosErr = Object.assign(new Error('Request failed'), {
      isAxiosError: true,
      response: {
        status: 503,
        data: { error: { message: 'service unavailable' } },
        headers: { 'content-type': 'application/json' },
      },
    });
    jest.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true);

    const result = normalizeHttpError(axiosErr);
    expect(result.status).toBe(503);
    expect(result.error.message).toBe('service unavailable');
  });

  test('falls back gracefully for non-Error unknowns', () => {
    const result = normalizeHttpError('string error');
    expect(result.error.message).toBe('Unknown error');
  });
});
