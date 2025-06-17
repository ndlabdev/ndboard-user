import { apiFetch } from '../fetcher'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, LoginGoogleResponse } from '@/types'

export function loginApi(payload: LoginRequest): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function registerApi(payload: RegisterRequest): Promise<RegisterResponse> {
    return apiFetch<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function loginGoogleApi(): Promise<LoginGoogleResponse> {
    return apiFetch<LoginGoogleResponse>('/auth/google')
}

export function loginGoogleCallbackApi(): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/google/callback')
}