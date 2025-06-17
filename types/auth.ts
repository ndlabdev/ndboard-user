export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    data?: {
        token: string
        user: {
            id: string
            name: string
            email: string
            role: string
            provider: string
            createdAt: string
            isVerified: boolean
        }
    }
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface RegisterResponse {
    data: {
        user: {
            id: string
            name: string
            email: string
            role: string
            provider: string
            createdAt: string
            isVerified: boolean
        }
    }
}

export interface LoginGoogleResponse {
    data: {
        url: string
    }
}
