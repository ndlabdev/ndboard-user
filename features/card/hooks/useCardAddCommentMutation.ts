import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardAddCommentApi } from '@/lib/api'
import type { CardGetListResponse, CardAddCommentResponse } from '@/types'
import type { CardAddCommentFormValues } from '@/features/card'

export function useCardAddCommentMutation(cardId: string, listId: string) {
    const queryClient = useQueryClient()

    return useMutation<CardAddCommentResponse, unknown, CardAddCommentFormValues>({
        mutationFn: (body) => cardAddCommentApi(cardId, body),
        onSuccess: (data) => {
            queryClient.setQueryData(['cards', listId], (old: CardGetListResponse | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((card) =>
                        card.id === cardId
                            ? {
                                ...card,
                                comments: [data.data, ...(card.comments ?? [])],
                                activities: [
                                    ...(data.data.activities ? [data.data.activities] : []),
                                    ...(card.activities ?? [])
                                ]
                            }
                            : card
                    )
                }
            })
        }
    })
}
