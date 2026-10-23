import { env } from '../config/app-config'
import { getStoredToken } from '../token-storage'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers } = options

  // JWT is read from storage on each call so it is always current,
  // including right after login/logout.
  const token = getStoredToken()

  let response: Response
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Network error: unable to reach the server', 0)
  }

  if (!response.ok) {
    throw await createApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

async function createApiError(response: Response): Promise<ApiError> {
  const message = await extractErrorMessage(response)
  return new ApiError(message, response.status)
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as Record<string, unknown>
    const detail = data?.message ?? data?.error ?? data?.detail
    if (typeof detail === 'string' && detail.length > 0) {
      return detail
    }
  } catch {
    // Response body is not JSON; fall back to the status text.
  }
  return `Request failed: ${response.status} ${response.statusText}`
}
