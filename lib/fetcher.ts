export type ApiError = {
    code: string
    message: string
    data?: unknown
}

export async function apiFetch<T>(
    url: string,
    options?: RequestInit & { parseJson?: boolean }
): Promise<T> {
    const { parseJson = true, ...fetchOptions } = options || {}

    let token: string | null = null

    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token')
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
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
