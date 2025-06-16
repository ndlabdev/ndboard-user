import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { loginApi } from '@/lib/api/auth.api'
import type { LoginRequest, LoginResponse } from '@/types/auth'

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
