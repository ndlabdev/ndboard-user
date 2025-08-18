import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardDeleteChecklistItemApi } from '@/lib/api'
import type { CardDeleteChecklistItemResponse, CardGetListResponse } from '@/types'
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
                                            items: list.items.filter((x) => x.id !== payload.id)
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
