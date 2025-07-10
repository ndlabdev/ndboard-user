export interface ApiResponse<T = unknown> {
    code: string
    message: string
    data?: T
    meta?: PaginateMeta
}

export interface PaginateMeta {
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface ApiError {
    code: string
    message: string
    data?: unknown
}

export type ApiFetchOptions = RequestInit & {
    parseJson?: boolean
    query?: Record<string, string | number | boolean | undefined | null>
}
