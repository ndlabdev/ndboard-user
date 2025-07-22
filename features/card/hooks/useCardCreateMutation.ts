import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardCreateApi } from '@/lib/api'
import type { CardCreateResponse } from '@/types'
import type { CardCreateFormValues } from '@/features/card'

export function useCardCreateMutation(
    onSuccess?: (_data: CardCreateResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardCreateResponse, unknown, CardCreateFormValues, unknown> {
    return useMutation<CardCreateResponse, unknown, CardCreateFormValues>({
        mutationFn: cardCreateApi,
        onSuccess,
        onError
    })
}
