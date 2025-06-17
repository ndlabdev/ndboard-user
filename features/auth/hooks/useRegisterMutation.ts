import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { registerApi } from '@/lib/api'
import type { RegisterRequest, RegisterResponse } from '@/types/auth'

export function useRegisterMutation(
    onSuccess?: (_data: RegisterResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<RegisterResponse, unknown, RegisterRequest, unknown> {
    return useMutation<RegisterResponse, unknown, RegisterRequest>({
        mutationFn: registerApi,
        onSuccess,
        onError
    })
}
