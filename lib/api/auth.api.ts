import { apiFetch } from '../fetcher'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types'

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