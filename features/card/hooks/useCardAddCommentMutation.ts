import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cardAddCommentApi } from '@/lib/api'
import type { CardAddCommentResponse, BoardCardsResponse } from '@/types'
import type { CardAddCommentFormValues } from '@/features/card'

export function useCardAddCommentMutation(cardId: string) {
    const queryClient = useQueryClient()

    return useMutation<CardAddCommentResponse, unknown, CardAddCommentFormValues>({
        mutationFn: (body) => cardAddCommentApi(cardId, body),
        onSuccess: (data) => {
            queryClient.setQueryData(['cards', data.data.cardId], (old: { data: BoardCardsResponse } | undefined) => {
                if (!old) return old

                return {
                    data: {
                        ...old.data,
                        comments: [data.data, ...(old.data.comments ?? [])],
                        activities: [
                            ...(data.data.activities ? [data.data.activities] : []),
                            ...(old.data.activities ?? [])
                        ]
                    }
                }
            })
        }
    })
}
