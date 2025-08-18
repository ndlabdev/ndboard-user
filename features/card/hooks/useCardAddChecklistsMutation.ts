import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardAddChecklistsApi } from '@/lib/api'
import type { CardAddChecklistsResponse, CardGetListResponse } from '@/types'
import type { CardAddChecklistsFormValues } from '@/features/card'

export function useCardAddChecklistsMutation(
    onSuccess?: (_data: CardAddChecklistsResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardAddChecklistsResponse, unknown, CardAddChecklistsFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardAddChecklistsResponse, unknown, CardAddChecklistsFormValues>({
        mutationFn: cardAddChecklistsApi,
        onSuccess: (data) => {
            queryClient.setQueryData(
                ['cards', data.data.listId],
                (old: CardGetListResponse | undefined) => {
                    if (!old) return old

                    return {
                        ...old,
                        data: old.data.map((card) =>
                            card.id === data.data.cardId
                                ? {
                                    ...card,
                                    activities: [
                                        ...(data.data.activities ? [data.data.activities] : []),
                                        ...(card.activities ?? [])
                                    ]
                                }
                                : card
                        )
                    }
                }
            )

            onSuccess?.(data)
        },
        onError
    })
}
