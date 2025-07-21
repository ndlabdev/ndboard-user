import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { listCopyApi } from '@/lib/api'
import type { BoardDetailResponse, ListCopyResponse } from '@/types'
import type { ListCopyFormValues } from '@/features/list'
import { toast } from 'sonner'

export function useListCopyMutation(
    listId: string,
    shortLink: string,
    options?: {
        onCopySuccess?: (_data: ListCopyResponse) => void
    }
): UseMutationResult<ListCopyResponse, unknown, ListCopyFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<ListCopyResponse, unknown, ListCopyFormValues>({
        mutationFn: listCopyApi,
        onSuccess: ({ data }) => {
            queryClient.setQueryData(['boards', shortLink], (old: BoardDetailResponse | undefined) => {
                if (!old || !old.data) return old

                const idx = old.data.lists.findIndex((l) => l.id === listId)
                const newLists = [...old.data.lists]

                newLists.splice(idx + 1, 0, data)

                return {
                    ...old,
                    data: {
                        ...old.data,
                        lists: newLists
                    }
                }
            })

            toast.success('List copied successfully!', {
                description: `List "${data.name}" has been copied.`
            })

            options?.onCopySuccess?.({ data })
        }
    })
}
