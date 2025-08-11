import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardUpdateChecklistApi } from '@/lib/api'
import type { CardAddChecklistsResponse } from '@/types'
import type { CardUpdateChecklistFormValues } from '@/features/card'

export function useCardUpdateChecklistMutation(
    onSuccess?: (_data: CardAddChecklistsResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistsResponse, unknown, CardUpdateChecklistFormValues, unknown> {
    return useMutation<CardAddChecklistsResponse, unknown, CardUpdateChecklistFormValues>({
        mutationFn: cardUpdateChecklistApi,
        onSuccess,
        onError
    })
}
