import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardDeleteApi } from '@/lib/api'
import { CardCreateResponse } from '@/types'
import { toast } from 'sonner'

export function useCardDeleteMutation(): UseMutationResult<CardCreateResponse, unknown, { id: string }, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardCreateResponse, unknown, { id: string }>({
        mutationFn: cardDeleteApi,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['cards', 'archived', data.data.boardId]
            })

            toast.success('Card deleted successfully!', {
                description: 'This card has been permanently deleted.'
            })
        },
        onError: (error) => {
            const msg = (error as { message?: string })?.message || 'Failed to delete card.'
            toast.error(msg)
        }
    })
}
