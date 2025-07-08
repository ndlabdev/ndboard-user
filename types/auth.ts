import { User } from './user'

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    data: {
        token: string
        user: User['data']
    }
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface RegisterResponse {
    data: {
        user: User['data']
    }
}

export interface LoginSocialParams {
    code: string
    state: string
}

export interface LoginSocialResponse {
    data: {
        url: string
    }
}

export interface RefreshTokenResponse {
    data?: {
        token: string
        user: User['data']
    }
}