export class ApiError extends Error {
  status: number;
  code: string | null;
  fields: Record<string, string> | null;

  constructor(
    message: string,
    {
      code = null,
      fields = null,
      status = 500
    }: { code?: string | null; fields?: Record<string, string> | null; status?: number } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fields = fields;
    this.status = status;
  }
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  fetcher?: typeof fetch;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, fetcher = fetch } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const fetchOptions: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(!isFormData && body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    }
  };

  if (body !== undefined) {
    fetchOptions.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetcher(path, fetchOptions);

  // Read response as text first to handle empty responses
  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON response', e);
    }
  }

  if (!response.ok) {
    const error = (
      payload as { error?: { message?: string; code?: string; fields?: Record<string, string> } }
    )?.error;
    throw new ApiError(error?.message ?? 'Request failed', {
      code: error?.code ?? null,
      fields: error?.fields ?? null,
      status: response.status
    });
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}
