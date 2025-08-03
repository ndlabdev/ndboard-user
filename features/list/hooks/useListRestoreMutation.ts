import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listRestoreApi } from '@/lib/api'
import { BoardDetailResponse, ListUpdateResponse } from '@/types'
import { toast } from 'sonner'

export function useListRestoreMutation(shortLink: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: listRestoreApi,
        onSuccess: (data: ListUpdateResponse) => {
            queryClient.setQueryData(['boards', shortLink], (old: BoardDetailResponse | undefined) => {
                if (!old?.data?.lists) return old

                const lists = [...old.data.lists, data.data]
                lists.sort((a, b) => a.order - b.order)

                return {
                    ...old,
                    data: {
                        ...old.data,
                        lists
                    }
                }
            })
            queryClient.invalidateQueries({
                queryKey: ['lists', 'archived', data.data.boardId]
            })
            toast.success('List restored successfully!', {
                description: 'This list has been restored to your board.'
            })
        }
    })
}
