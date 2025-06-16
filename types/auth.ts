export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    code: string
    message: string
    data?: {
        token: string
    }
}