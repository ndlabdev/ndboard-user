import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardDeleteChecklistApi } from '@/lib/api'
import type { BoardCardsResponse, CardDeleteChecklistItemResponse } from '@/types'
import type { CardDeleteChecklistFormValues } from '@/features/card'

export function useCardDeleteChecklistMutation(
    listId: string,
    onSuccess?: (_data: CardDeleteChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistFormValues>({
        mutationFn: cardDeleteChecklistApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['cards', data.data.cardId], (old: { data: BoardCardsResponse } | undefined) => {
                if (!old) return old

                return {
                    data: {
                        ...old.data,
                        checklists: old.data.checklists.filter((cl) => cl.id !== data.data.id),
                        activities: [
                            ...(data.data.activities ? [data.data.activities] : []),
                            ...(old.data.activities ?? [])
                        ]
                    }
                }
            })

            onSuccess?.(data)
        },
        onError
    })
}
