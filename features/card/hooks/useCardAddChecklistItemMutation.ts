import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardAddChecklistItemApi } from '@/lib/api'
import type { BoardCardsResponse, CardAddChecklistItemResponse } from '@/types'
import type { CardAddChecklistItemFormValues } from '@/features/card'

export function useCardAddChecklistItemMutation(
    onSuccess?: (_data: CardAddChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistItemResponse, unknown, CardAddChecklistItemFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardAddChecklistItemResponse, unknown, CardAddChecklistItemFormValues>({
        mutationFn: cardAddChecklistItemApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['cards', data.data.cardId], (old: { data: BoardCardsResponse } | undefined) => {
                if (!old) return old

                return {
                    data: {
                        ...old.data,
                        activities: [
                            ...(data.data.activities ? [data.data.activities] : []),
                            ...(old.data.activities ?? [])
                        ],
                        checklists: old.data.checklists.map((list) =>
                            list.id !== data.data.checklistId
                                ? list
                                : {
                                    ...list,
                                    items: [...list.items, data.data]
                                }
                        )
                    }
                }
            })

            onSuccess?.(data)
        },
        onError
    })
}
