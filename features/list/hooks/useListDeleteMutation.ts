import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { listDeleteApi } from '@/lib/api'
import { ListUpdateResponse } from '@/types'
import { toast } from 'sonner'

export function useListDeleteMutation(): UseMutationResult<ListUpdateResponse, unknown, { id: string }, unknown> {
    const queryClient = useQueryClient()

    return useMutation<ListUpdateResponse, unknown, { id: string }>({
        mutationFn: listDeleteApi,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['lists', 'archived', data.data.boardId]
            })

            queryClient.invalidateQueries({
                queryKey: ['cards', 'archived', data.data.boardId]
            })

            toast.success('List deleted successfully!', {
                description: 'This list has been permanently deleted.'
            })
        },
        onError: (error) => {
            const msg = (error as { message?: string })?.message || 'Failed to delete list.'
            toast.error(msg)
        }
    })
}
