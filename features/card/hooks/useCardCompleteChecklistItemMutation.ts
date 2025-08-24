import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardCompleteChecklistItemApi } from '@/lib/api'
import type { BoardCardsResponse, CardAddChecklistItemResponse } from '@/types'
import type { CardCompleteChecklistItemFormValues } from '@/features/card'

export function useCardCompleteChecklistItemMutation(
    listId: string,
    onSuccess?: (_data: CardAddChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistItemResponse, unknown, CardCompleteChecklistItemFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardAddChecklistItemResponse, unknown, CardCompleteChecklistItemFormValues>({
        mutationFn: cardCompleteChecklistItemApi,
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
                                    items: list.items.map((item) =>
                                        item.id !== data.data.id
                                            ? item
                                            : { ...item, isChecked: data.data.isChecked }
                                    )
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
