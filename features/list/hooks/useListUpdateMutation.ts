import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { listUpdateApi } from '@/lib/api'
import type { BoardDetailResponse, ListUpdateResponse } from '@/types'
import type { ListUpdateFormValues } from '@/features/list'

export function useListUpdateMutation(
    listId: string,
    shortLink: string
): UseMutationResult<ListUpdateResponse, unknown, ListUpdateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<ListUpdateResponse, unknown, ListUpdateFormValues>({
        mutationFn: listUpdateApi,
        onSuccess: () => {
            queryClient.setQueryData(['boards', shortLink], (old: BoardDetailResponse) => ({
                ...old,
                data: {
                    ...old.data,
                    lists: old.data.lists.map((list) => ({
                        ...list,
                        isFold: list.id === listId ? !list.isFold : list.isFold
                    }))
                }
            }))
        }
    })
}
