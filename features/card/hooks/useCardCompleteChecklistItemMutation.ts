import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardCompleteChecklistItemApi } from '@/lib/api'
import type { CardAddChecklistItemResponse, CardGetListResponse } from '@/types'
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
            queryClient.setQueryData(['cards', listId], (old: CardGetListResponse | undefined) => {
                if (!old) return old
                const payload = data?.data
                if (!payload) return old

                return {
                    ...old,
                    data: old.data.map((card) =>
                        card.id !== payload.cardId
                            ? card
                            : {
                                ...card,
                                activities: [
                                    ...(data.data.activities ? [data.data.activities] : []),
                                    ...(card.activities ?? [])
                                ],
                                checklists: card.checklists.map((list) =>
                                    list.id !== payload.checklistId
                                        ? list
                                        : {
                                            ...list,
                                            items: list.items.map((item) =>
                                                item.id !== payload.id
                                                    ? item
                                                    : { ...item, isChecked: payload.isChecked }
                                            )
                                        }
                                )
                            }
                    )
                }
            })
            onSuccess?.(data)
        },
        onError
    })
}
