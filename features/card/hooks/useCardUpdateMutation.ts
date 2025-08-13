import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardUpdateApi } from '@/lib/api'
import type { CardGetListResponse, CardUpdateResponse } from '@/types'
import type { CardUpdateFormValues } from '@/features/card'

export function useCardUpdateMutation(
    onSuccess?: (_data: CardUpdateResponse) => void
): UseMutationResult<CardUpdateResponse, unknown, CardUpdateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardUpdateResponse, unknown, CardUpdateFormValues>({
        mutationFn: cardUpdateApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['cards', data.data.listId], (old: CardGetListResponse | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((card) =>
                        card.id === data.data.id
                            ? {
                                ...card,
                                name: data.data.name,
                                labels: data.data.labels,
                                description: data.data.description,
                                updatedAt: data.data.updatedAt
                            }
                            : card
                    )
                }
            })

            onSuccess?.(data)
        }
    })
}
