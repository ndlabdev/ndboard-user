import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listArchiveApi } from '@/lib/api'
import { BoardDetailResponse } from '@/types'
import { toast } from 'sonner'

export function useListArchiveMutation(listId: string, shortLink: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: listArchiveApi,
        onSuccess: () => {
            queryClient.setQueryData(['boards', shortLink], (old: BoardDetailResponse) => {
                if (!old?.data?.lists) return old

                return {
                    ...old,
                    data: {
                        ...old.data,
                        lists: old.data.lists.filter((l) => l.id !== listId)
                    }
                }
            })
            toast.success('List archived successfully!')
        }
    })
}
