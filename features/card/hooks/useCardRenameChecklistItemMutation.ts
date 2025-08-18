import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardRenameChecklistItemApi } from '@/lib/api'
import type { CardAddChecklistItemResponse, CardGetListResponse } from '@/types'
import type { CardRenameChecklistItemFormValues } from '@/features/card'

export function useCardRenameChecklistItemMutation(
    onSuccess?: (_data: CardAddChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistItemResponse, unknown, CardRenameChecklistItemFormValues> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: cardRenameChecklistItemApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['cards', data.data.listId], (old: CardGetListResponse | undefined) => {
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
                                ]
                            }
                    )
                }
            })
            onSuccess?.(data)
        },
        onError
    })
}
