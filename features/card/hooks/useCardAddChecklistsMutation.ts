import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardAddChecklistsApi } from '@/lib/api'
import type { BoardCardsResponse, CardAddChecklistsResponse } from '@/types'
import type { CardAddChecklistsFormValues } from '@/features/card'

export function useCardAddChecklistsMutation(
    onSuccess?: (_data: CardAddChecklistsResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistsResponse, unknown, CardAddChecklistsFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardAddChecklistsResponse, unknown, CardAddChecklistsFormValues>({
        mutationFn: cardAddChecklistsApi,
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
