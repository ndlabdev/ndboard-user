import { ApiError, ApiFetchOptions } from '@/types/api-common'

/**
 * Get JWT token from cookie by name
 */
function getTokenFromCookie(tokenName: string): string | undefined {
    if (typeof document === 'undefined') return undefined
    const match = document.cookie.match(new RegExp(`(^| )${tokenName}=([^;]+)`))

    return match ? decodeURIComponent(match[2]) : undefined
}

/**
 * Build query string from query object
 */
function buildQueryString(query?: Record<string, string | number | boolean | undefined | null>): string {
    if (!query) return ''
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value))
        }
    })

    return params.toString() ? `?${params.toString()}` : ''
}

/**
 * Clear token cookie and redirect to login page
 */
function forceLogout() {
    if (typeof window !== 'undefined') {
        document.cookie = 'token=; Max-Age=0; path=/'
        window.location.href = '/login'
    }
}

/**
 * Shared promise to ensure only one refresh token request at a time
 */
let isRefreshing = false
let refreshPromise: Promise<void> | null = null

/**
 * Main apiFetch with auto-refresh token and retry once
 */
export async function apiFetch<T>(
    url: string,
    options?: ApiFetchOptions,
    _retry = false
): Promise<T> {
    const { parseJson = true, query, ...fetchOptions } = options || {}
    const token = getTokenFromCookie('token')
    const queryString = buildQueryString(query)
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}${queryString}`

    if (isRefreshing && refreshPromise) {
        await refreshPromise
    }

    let res: Response
    try {
        res = await fetch(fullUrl, {
            ...fetchOptions,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(fetchOptions.headers || {})
            }
        })
    } catch (err) {
        // Handle network error
        throw {
            code: 'NETWORK_ERROR',
            message: (err instanceof Error ? err.message : 'Network error') || 'Network error'
        } satisfies ApiError
    }

    let result: unknown = undefined

    if (parseJson) {
        try {
            result = await res.json()
        } catch {
            result = null
        }
    }

    // Handle Unauthorized (401)
    if (res.status === 401 && !_retry) {
        if (!isRefreshing) {
            isRefreshing = true
            refreshPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include'
            }).then(async (refreshRes) => {
                if (!refreshRes.ok) throw new Error('Refresh token failed')
                // Optionally: handle set-cookie or refresh logic here
            }).finally(() => {
                isRefreshing = false
                refreshPromise = null
            })
        }

        try {
            await refreshPromise

            // Retry original request ONCE after refresh
            return apiFetch<T>(url, options, true)
        } catch {
            forceLogout()
            throw {
                code: 'UNAUTHORIZED',
                message: 'Session expired. Please login again.'
            } satisfies ApiError
        }
    }

    // Other HTTP errors
    if (!res.ok) {
        const err = (result as { code?: string; message?: string; data?: unknown }) || {}
        throw {
            code: err.code ?? 'API_ERROR',
            message: err.message ?? 'Server error',
            data: err.data
        } satisfies ApiError
    }

    return result as T
}