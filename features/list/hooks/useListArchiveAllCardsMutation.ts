import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listArchiveAllCardsApi } from '@/lib/api'
import { toast } from 'sonner'
import { BoardListsResponse } from '@/types'

export function useListArchiveAllCardsMutation(column: BoardListsResponse) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: listArchiveAllCardsApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['cards', 'archived', column.boardId]
            })
            queryClient.setQueryData(['cards', column.id], { data: [] })
            toast.success(`All cards in list "${column.name}" have been archived!`)
        },
        onError: () => {
            toast.error('Failed to archive all cards. Please try again.')
        }
    })
}
