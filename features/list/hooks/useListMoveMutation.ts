import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { listMoveApi } from '@/lib/api'
import type { BoardDetailResponse, ListMoveResponse } from '@/types'
import type { ListMoveFormValues } from '@/features/list'

export function useListMoveMutation(
    shortLinkOld: string,
    shortLinkNew: string,
    onSuccess?: () => void,
    onError?: (_error: unknown) => void
): UseMutationResult<ListMoveResponse, unknown, ListMoveFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<ListMoveResponse, unknown, ListMoveFormValues>({
        mutationFn: listMoveApi,
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['boards', shortLinkOld], (old: BoardDetailResponse | undefined) => {
                if (!old || !old.data) return old

                return {
                    ...old,
                    data: {
                        ...old.data,
                        lists: old.data.lists.filter((l) => l.id !== variables.id)
                    }
                }
            })

            queryClient.setQueryData(['boards', shortLinkNew], (old: BoardDetailResponse | undefined) => {
                if (!old || !old.data) return old

                return {
                    ...old,
                    data: {
                        ...old.data,
                        lists: [...old.data.lists, data.data]
                    }
                }
            })

            onSuccess?.()
        },
        onError
    })
}
