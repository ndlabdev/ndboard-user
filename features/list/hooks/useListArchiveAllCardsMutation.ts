import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listArchiveAllCardsApi } from '@/lib/api'
import { toast } from 'sonner'
import { BoardListsResponse } from '@/types'
import { Dispatch, SetStateAction } from 'react'

export function useListArchiveAllCardsMutation(column: BoardListsResponse, setIsMenuOpen: Dispatch<SetStateAction<boolean>>) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: listArchiveAllCardsApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['cards', 'archived', column.boardId]
            })
            queryClient.setQueryData(['cards', column.id], { data: [] })
            setIsMenuOpen(false)
            toast.success(`All cards in list "${column.name}" have been archived!`)
        },
        onError: () => {
            toast.error('Failed to archive all cards. Please try again.')
        }
    })
}
