import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardCompleteChecklistItemApi } from '@/lib/api'
import type { CardAddChecklistItemResponse } from '@/types'
import type { CardCompleteChecklistItemFormValues } from '@/features/card'

export function useCardCompleteChecklistItemMutation(
    onSuccess?: (_data: CardAddChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistItemResponse, unknown, CardCompleteChecklistItemFormValues, unknown> {
    return useMutation<CardAddChecklistItemResponse, unknown, CardCompleteChecklistItemFormValues>({
        mutationFn: cardCompleteChecklistItemApi,
        onSuccess,
        onError
    })
}
