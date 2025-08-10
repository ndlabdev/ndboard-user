import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardDeleteChecklistItemApi } from '@/lib/api'
import type { CardDeleteChecklistItemResponse } from '@/types'
import type { CardDeleteChecklistItemFormValues } from '@/features/card'

export function useCardDeleteChecklistItemMutation(
    onSuccess?: (_data: CardDeleteChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistItemFormValues, unknown> {
    return useMutation<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistItemFormValues>({
        mutationFn: cardDeleteChecklistItemApi,
        onSuccess,
        onError
    })
}
