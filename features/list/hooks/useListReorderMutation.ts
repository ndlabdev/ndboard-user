import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { listReorderApi } from '@/lib/api'
import type { ListReorderFormValues } from '@/features/list'
import { BoardDetailResponse } from '@/types'

export function useListReorderMutation(shortLink: string): UseMutationResult<unknown, unknown, ListReorderFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<unknown, unknown, ListReorderFormValues>({
        mutationFn: listReorderApi,
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(['boards', shortLink], (old: BoardDetailResponse) => {
                const newLists = [...old.data.lists]
                newLists.sort((a, b) => {
                    const aOrder = variables.lists.findIndex((l) => l.id === a.id)
                    const bOrder = variables.lists.findIndex((l) => l.id === b.id)

                    return aOrder - bOrder
                })

                return {
                    ...old,
                    data: {
                        ...old.data,
                        lists: newLists
                    }
                }
            })
        }
    })
}
