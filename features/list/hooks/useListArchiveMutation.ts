import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { listArchiveApi } from '@/lib/api'
import { BoardDetailResponse, ListUpdateResponse } from '@/types'
import { toast } from 'sonner'
import { useListRestoreMutation } from './useListRestoreMutation'

export function useListArchiveMutation(
    listId: string,
    shortLink: string
): UseMutationResult<ListUpdateResponse, unknown, { id: string }, unknown> {
    const queryClient = useQueryClient()
    const restoreMutation = useListRestoreMutation(shortLink)

    return useMutation<ListUpdateResponse, unknown, { id: string }>({
        mutationFn: listArchiveApi,
        onSuccess: (data) => {
            let archivedIndex: number | null = null

            queryClient.setQueryData(['boards', shortLink], (old: BoardDetailResponse) => {
                if (!old?.data?.lists) return old

                const idx = old.data.lists.findIndex((l) => l.id === listId)
                archivedIndex = idx

                return {
                    ...old,
                    data: {
                        ...old.data,
                        lists: old.data.lists.filter((l) => l.id !== listId)
                    }
                }
            })

            queryClient.invalidateQueries({
                queryKey: ['lists', 'archived', data.data.boardId]
            })

            toast.success('List archived successfully!', {
                description: 'This list has been archived. You can undo this action.',
                action: {
                    label: 'Undo',
                    onClick: () => {
                        if (archivedIndex !== null) {
                            restoreMutation.mutate({
                                id: listId,
                                index: archivedIndex
                            })
                        }
                    }
                }
            })
        }
    })
}
