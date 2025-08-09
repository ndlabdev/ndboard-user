import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardAddChecklistItemApi } from '@/lib/api'
import type { CardAddChecklistItemResponse } from '@/types'
import type { CardAddChecklistItemFormValues } from '@/features/card'

export function useCardAddChecklistItemMutation(
    onSuccess?: (_data: CardAddChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistItemResponse, unknown, CardAddChecklistItemFormValues, unknown> {
    return useMutation<CardAddChecklistItemResponse, unknown, CardAddChecklistItemFormValues>({
        mutationFn: cardAddChecklistItemApi,
        onSuccess,
        onError
    })
}
