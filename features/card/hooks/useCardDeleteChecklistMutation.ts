import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardDeleteChecklistApi } from '@/lib/api'
import type { CardDeleteChecklistItemResponse } from '@/types'
import type { CardDeleteChecklistFormValues } from '@/features/card'

export function useCardDeleteChecklistMutation(
    onSuccess?: (_data: CardDeleteChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistFormValues, unknown> {
    return useMutation<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistFormValues>({
        mutationFn: cardDeleteChecklistApi,
        onSuccess,
        onError
    })
}
