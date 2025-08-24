import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardDeleteChecklistItemApi } from '@/lib/api'
import type { BoardCardsResponse, CardDeleteChecklistItemResponse } from '@/types'
import type { CardDeleteChecklistItemFormValues } from '@/features/card'

export function useCardDeleteChecklistItemMutation(
    listId: string,
    onSuccess?: (_data: CardDeleteChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistItemFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistItemFormValues>({
        mutationFn: cardDeleteChecklistItemApi,
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
                                    items: list.items.filter((x) => x.id !== data.data.id)
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
