import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardRenameChecklistItemApi } from '@/lib/api'
import type { BoardCardsResponse, CardAddChecklistItemResponse } from '@/types'
import type { CardRenameChecklistItemFormValues } from '@/features/card'

export function useCardRenameChecklistItemMutation(
    onSuccess?: (_data: CardAddChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistItemResponse, unknown, CardRenameChecklistItemFormValues> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: cardRenameChecklistItemApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['cards', data.data.cardId], (old: { data: BoardCardsResponse } | undefined) => {
                if (!old) return old

                return {
                    data: {
                        ...old.data,
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
