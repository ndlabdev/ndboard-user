import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardBulkReorderApi } from '@/lib/api'
import type { CardBulkReorderFormValues } from '@/features/card'
import type { CardGetListItem, CardGetListResponse } from '@/types'

export function useCardBulkReorderMutation(): UseMutationResult<unknown, unknown, CardBulkReorderFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<unknown, unknown, CardBulkReorderFormValues>({
        mutationFn: cardBulkReorderApi,
        onSuccess: (_data, variables) => {
            const allCardsMap = new Map<string, CardGetListItem>()
            variables.lists.forEach((list) => {
                const cached = queryClient.getQueryData<CardGetListResponse>(['cards', list.listId])
                cached?.data.forEach((card) => {
                    allCardsMap.set(card.id, card)
                })
            })

            variables.lists.forEach((list) => {
                queryClient.setQueryData(['cards', list.listId], (old: CardGetListResponse | undefined) => {
                    if (!old) return old

                    const newCards = list.cards
                        .map((cardOrder) => allCardsMap.get(cardOrder.id))
                        .filter(Boolean) as CardGetListResponse['data']

                    return {
                        ...old,
                        data: newCards
                    }
                })
            })
        }
    })
}
