import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { loginApi, loginGoogleApi, loginGoogleCallbackApi } from '@/lib/api'
import type { LoginRequest, LoginResponse, LoginGoogleResponse, LoginSocialParams } from '@/types/auth'

export function useLoginMutation(
    onSuccess?: (_data: LoginResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginResponse, unknown, LoginRequest, unknown> {
    return useMutation<LoginResponse, unknown, LoginRequest>({
        mutationFn: loginApi,
        onSuccess,
        onError
    })
}

export function useLoginGoogleMutation(
    onSuccess?: (_data: LoginGoogleResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginGoogleResponse, unknown, unknown, unknown> {
    return useMutation<LoginGoogleResponse, unknown, unknown>({
        mutationFn: loginGoogleApi,
        onSuccess,
        onError
    })
}

export function useLoginGoogleCallbackMutation(
    onSuccess?: (_data: LoginResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginResponse, unknown, LoginSocialParams, unknown> {
    return useMutation<LoginResponse, unknown, LoginSocialParams>({
        mutationFn: loginGoogleCallbackApi,
        onSuccess,
        onError
    })
}
