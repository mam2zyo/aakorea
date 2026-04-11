export class ApiError extends Error {
  constructor(message, { code = null, fields = null, status = 500 } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.fields = fields
    this.status = status
  }
}

export async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
  } = options

  const isFormData = body instanceof FormData

  const response = await fetch(path, {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(!isFormData && body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: isFormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
  })

  const payload = await readJson(response)

  if (!response.ok) {
    const error = payload?.error
    throw new ApiError(error?.message ?? 'request failed', {
      code: error?.code ?? null,
      fields: error?.fields ?? null,
      status: response.status,
    })
  }

  return payload?.data ?? null
}

async function readJson(response) {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
