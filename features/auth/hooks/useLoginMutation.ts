import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { authLoginApi, authLoginGoogleApi, authLoginGoogleCallbackApi, authLoginGithubApi, authLoginGithubCallbackApi } from '@/lib/api'
import type { LoginRequest, LoginResponse, LoginSocialResponse, LoginSocialParams } from '@/types'

export function useLoginMutation(
    onSuccess?: (_data: LoginResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginResponse, unknown, LoginRequest, unknown> {
    return useMutation<LoginResponse, unknown, LoginRequest>({
        mutationFn: authLoginApi,
        onSuccess,
        onError
    })
}

export function useLoginGoogleMutation(
    onSuccess?: (_data: LoginSocialResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginSocialResponse, unknown, unknown, unknown> {
    return useMutation<LoginSocialResponse, unknown, unknown>({
        mutationFn: authLoginGoogleApi,
        onSuccess,
        onError
    })
}

export function useLoginGoogleCallbackMutation(
    onSuccess?: (_data: LoginResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginResponse, unknown, LoginSocialParams, unknown> {
    return useMutation<LoginResponse, unknown, LoginSocialParams>({
        mutationFn: authLoginGoogleCallbackApi,
        onSuccess,
        onError
    })
}

export function useLoginGithubMutation(
    onSuccess?: (_data: LoginSocialResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginSocialResponse, unknown, unknown, unknown> {
    return useMutation<LoginSocialResponse, unknown, unknown>({
        mutationFn: authLoginGithubApi,
        onSuccess,
        onError
    })
}

export function useLoginGithubCallbackMutation(
    onSuccess?: (_data: LoginResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginResponse, unknown, LoginSocialParams, unknown> {
    return useMutation<LoginResponse, unknown, LoginSocialParams>({
        mutationFn: authLoginGithubCallbackApi,
        onSuccess,
        onError
    })
}
