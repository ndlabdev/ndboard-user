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
}
