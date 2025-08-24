import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardUpdateChecklistApi } from '@/lib/api'
import type { BoardCardsResponse, CardAddChecklistsResponse } from '@/types'
import type { CardUpdateChecklistFormValues } from '@/features/card'

export function useCardUpdateChecklistMutation(
    onSuccess?: (_data: CardAddChecklistsResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistsResponse, unknown, CardUpdateChecklistFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardAddChecklistsResponse, unknown, CardUpdateChecklistFormValues>({
        mutationFn: cardUpdateChecklistApi,
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
