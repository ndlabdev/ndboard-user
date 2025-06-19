import { apiFetch } from '@/lib/fetcher'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, LoginSocialResponse, LoginSocialParams } from '@/types'

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

export function loginGoogleApi(): Promise<LoginSocialResponse> {
    return apiFetch<LoginSocialResponse>('/auth/google')
}

export function loginGoogleCallbackApi(params: LoginSocialParams): Promise<LoginResponse> {
    const query = new URLSearchParams({ code: params.code, ...(params.state ? { state: params.state } : {}) })

    return apiFetch<LoginResponse>(`/auth/google/callback?${query.toString()}`)
}

export function loginGithubApi(): Promise<LoginSocialResponse> {
    return apiFetch<LoginSocialResponse>('/auth/github')
}

export function loginGithubCallbackApi(params: LoginSocialParams): Promise<LoginResponse> {
    const query = new URLSearchParams({ code: params.code, ...(params.state ? { state: params.state } : {}) })

    return apiFetch<LoginResponse>(`/auth/github/callback?${query.toString()}`)
}
