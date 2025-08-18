import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardAddChecklistItemApi } from '@/lib/api'
import type { CardAddChecklistItemResponse, CardGetListResponse } from '@/types'
import type { CardAddChecklistItemFormValues } from '@/features/card'

export function useCardAddChecklistItemMutation(
    listId: string,
    onSuccess?: (_data: CardAddChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistItemResponse, unknown, CardAddChecklistItemFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardAddChecklistItemResponse, unknown, CardAddChecklistItemFormValues>({
        mutationFn: cardAddChecklistItemApi,
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
                                            items: [...list.items, payload]
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
