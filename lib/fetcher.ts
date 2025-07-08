export type ApiError = {
    code: string
    message: string
    data?: unknown
}

type ApiFetchOptions = RequestInit & {
    parseJson?: boolean
    query?: Record<string, string | number | boolean | undefined | null>
}

function getTokenFromCookie(tokenName: string): string | undefined {
    if (typeof document === 'undefined') return undefined
    const match = document.cookie.match(new RegExp(`(^| )${tokenName}=([^;]+)`))

    return match ? decodeURIComponent(match[2]) : undefined
}

function buildQueryString(query?: Record<string, string | number | boolean | undefined | null>): string {
    if (!query) return ''

    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, String(value))
        }
    })
    const str = params.toString()

    return str ? `?${str}` : ''
}

export async function apiFetch<T>(
    url: string,
    options?: ApiFetchOptions
): Promise<T> {
    const { parseJson = true, query, ...fetchOptions } = options || {}
    const token = getTokenFromCookie('token')
    const queryString = buildQueryString(query)
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}${queryString}`

    const res = await fetch(fullUrl, {
        ...fetchOptions,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(fetchOptions.headers || {})
        }
    })

    let result: unknown = undefined

    if (parseJson) {
        try {
            result = await res.json()
        } catch {
            result = null
        }
    }

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
