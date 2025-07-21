import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardCreateApi } from '@/lib/api'
import type { CardCreateResponse } from '@/types'
import type { CardCreateFormValues } from '@/features/card'
import { toast } from 'sonner'

export function useCardCreateMutation(
    listId: string,
    onSuccess?: (_data: CardCreateResponse) => void
): UseMutationResult<CardCreateResponse, unknown, CardCreateFormValues, unknown> {
    return useMutation<CardCreateResponse, unknown, CardCreateFormValues>({
        mutationFn: cardCreateApi,
        onSuccess: (data) => {
            // const insertIdx = typeof variables.index === 'number' ? variables.index : undefined

            // queryClient.setQueryData(['cards', listId], (old: CardGetListResponse | undefined) => {
            //     const prevCards: CardGetListResponse['data'] = old?.data || []
            //     const newCards = [...prevCards]
            //     if (typeof insertIdx === 'number' && insertIdx >= 0 && insertIdx <= prevCards.length) {
            //         newCards.splice(insertIdx, 0, data)
            //     } else {
            //         newCards.push(data)
            //     }

            //     // setCards((prev) => {
            //     //     const newCards = [...prev]
            //     //     if (idx === 'end' || idx === null) {
            //     //         newCards.push(data)
            //     //     } else {
            //     //         newCards.splice(idx, 0, data)
            //     //     }

            //     //     return newCards
            //     // })

            //     return { ...old, data: newCards }
            // })
            // toast.success('Card Created Successfully!')
            onSuccess?.(data)
        },
        onError: (error) => {
            const msg = (error as { message?: string })?.message || 'Create Card Failed'
            toast.error(msg)
        }
    })
}
