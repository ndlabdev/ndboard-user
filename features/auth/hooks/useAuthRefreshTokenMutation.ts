import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { authRefreshTokenApi } from '@/lib/api'
import type { RefreshTokenResponse } from '@/types'

export function useAuthRefreshTokenMutation(
    onSuccess?: (_data: RefreshTokenResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<RefreshTokenResponse, unknown, void, unknown> {
    return useMutation<RefreshTokenResponse, unknown, void>({
        mutationFn: authRefreshTokenApi,
        onSuccess,
        onError
    })
}
