import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { loginApi, loginGoogleApi, loginGoogleCallbackApi, loginGithubApi, loginGithubCallbackApi } from '@/lib/api'
import type { LoginRequest, LoginResponse, LoginSocialResponse, LoginSocialParams } from '@/types/auth'

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
    onSuccess?: (_data: LoginSocialResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginSocialResponse, unknown, unknown, unknown> {
    return useMutation<LoginSocialResponse, unknown, unknown>({
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

export function useLoginGithubMutation(
    onSuccess?: (_data: LoginSocialResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginSocialResponse, unknown, unknown, unknown> {
    return useMutation<LoginSocialResponse, unknown, unknown>({
        mutationFn: loginGithubApi,
        onSuccess,
        onError
    })
}

export function useLoginGithubCallbackMutation(
    onSuccess?: (_data: LoginResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<LoginResponse, unknown, LoginSocialParams, unknown> {
    return useMutation<LoginResponse, unknown, LoginSocialParams>({
        mutationFn: loginGithubCallbackApi,
        onSuccess,
        onError
    })
}
