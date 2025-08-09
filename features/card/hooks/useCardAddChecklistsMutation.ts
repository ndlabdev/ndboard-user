import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardAddChecklistsApi } from '@/lib/api'
import type { CardAddChecklistsResponse } from '@/types'
import type { CardAddChecklistsFormValues } from '@/features/card'

export function useCardAddChecklistsMutation(
    onSuccess?: (_data: CardAddChecklistsResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistsResponse, unknown, CardAddChecklistsFormValues, unknown> {
    return useMutation<CardAddChecklistsResponse, unknown, CardAddChecklistsFormValues>({
        mutationFn: cardAddChecklistsApi,
        onSuccess,
        onError
    })
}
