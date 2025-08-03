import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardRestoreApi } from '@/lib/api'
import { CardCreateResponse } from '@/types'
import { toast } from 'sonner'

export function useCardRestoreMutation(): UseMutationResult<CardCreateResponse, unknown, { id: string }, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardCreateResponse, unknown, { id: string }, unknown>({
        mutationFn: cardRestoreApi,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['cards', data.data.listId]
            })
            queryClient.invalidateQueries({
                queryKey: ['cards', 'archived', data.data.boardId]
            })
            toast.success('Card restored successfully!', {
                description: 'This card has been restored to its list.'
            })
        },
        onError: (error) => {
            const msg = (error as { message?: string })?.message || 'Failed to restore card.'
            toast.error(msg)
        }
    })
}
