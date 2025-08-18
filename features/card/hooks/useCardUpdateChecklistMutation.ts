import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardUpdateChecklistApi } from '@/lib/api'
import type { CardAddChecklistsResponse, CardGetListResponse } from '@/types'
import type { CardUpdateChecklistFormValues } from '@/features/card'

export function useCardUpdateChecklistMutation(
    onSuccess?: (_data: CardAddChecklistsResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistsResponse, unknown, CardUpdateChecklistFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardAddChecklistsResponse, unknown, CardUpdateChecklistFormValues>({
        mutationFn: cardUpdateChecklistApi,
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
