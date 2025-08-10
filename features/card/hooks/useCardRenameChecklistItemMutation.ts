import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardRenameChecklistItemApi } from '@/lib/api'
import type { CardAddChecklistItemResponse } from '@/types'
import type { CardRenameChecklistItemFormValues } from '@/features/card'

export function useCardRenameChecklistItemMutation(
    onSuccess?: (_data: CardAddChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistItemResponse, unknown, CardRenameChecklistItemFormValues> {
    return useMutation({
        mutationFn: cardRenameChecklistItemApi,
        onSuccess,
        onError
    })
}
