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

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface RegisterResponse {
    code: string
    message: string
    data?: {
        user: {
            id: string
            name: string
            email: string
        }
    }
}
