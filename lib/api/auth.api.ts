import { apiFetch } from '../fetcher'
import type { LoginRequest, LoginResponse } from '@/types'

export function loginApi(payload: LoginRequest): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}
