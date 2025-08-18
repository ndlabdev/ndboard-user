import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardDeleteChecklistApi } from '@/lib/api'
import type { CardDeleteChecklistItemResponse, CardGetListResponse } from '@/types'
import type { CardDeleteChecklistFormValues } from '@/features/card'

export function useCardDeleteChecklistMutation(
    listId: string,
    onSuccess?: (_data: CardDeleteChecklistItemResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardDeleteChecklistItemResponse, unknown, CardDeleteChecklistFormValues>({
        mutationFn: cardDeleteChecklistApi,
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
                                checklists: card.checklists.filter((cl) => cl.id !== payload.id),
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
