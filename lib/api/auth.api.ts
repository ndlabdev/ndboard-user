import { apiFetch } from '@/lib/fetcher'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, LoginSocialResponse, LoginSocialParams, RefreshTokenResponse } from '@/types'

export function authLoginApi(payload: LoginRequest): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function authRegisterApi(payload: RegisterRequest): Promise<RegisterResponse> {
    return apiFetch<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function authLoginGoogleApi(): Promise<LoginSocialResponse> {
    return apiFetch<LoginSocialResponse>('/auth/google')
}

export function authLoginGoogleCallbackApi(params: LoginSocialParams): Promise<LoginResponse> {
    const query = new URLSearchParams({ code: params.code, ...(params.state ? { state: params.state } : {}) })

    return apiFetch<LoginResponse>(`/auth/google/callback?${query.toString()}`)
}

export function authLoginGithubApi(): Promise<LoginSocialResponse> {
    return apiFetch<LoginSocialResponse>('/auth/github')
}

export function authLoginGithubCallbackApi(params: LoginSocialParams): Promise<LoginResponse> {
    const query = new URLSearchParams({ code: params.code, ...(params.state ? { state: params.state } : {}) })

    return apiFetch<LoginResponse>(`/auth/github/callback?${query.toString()}`)
}

export function authRefreshTokenApi(): Promise<RefreshTokenResponse> {
    return apiFetch<RefreshTokenResponse>('/auth/refresh-token', {
        method: 'POST'
    })
}

export function authLogoutApi() {
    return apiFetch('/auth/logout', {
        method: 'POST'
    })
}