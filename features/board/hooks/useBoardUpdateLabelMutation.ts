import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardUpdateLabelApi } from '@/lib/api'
import type { BoardDetailResponse, BoardUpdateLabelResponse } from '@/types'
import type { BoardLabelCreateFormValues } from '@/features/board'
import { toast } from 'sonner'

export function useBoardUpdateLabelMutation(
    shortLink: string,
    onSuccess?: (_data: unknown, _variables: BoardLabelCreateFormValues & { id: string }) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<BoardUpdateLabelResponse, unknown, BoardLabelCreateFormValues & { id: string }, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardUpdateLabelResponse, unknown, BoardLabelCreateFormValues & { id: string }, unknown>({
        mutationFn: boardUpdateLabelApi,
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(['boards', shortLink], (old: BoardDetailResponse) => {
                return {
                    ...old,
                    data: {
                        ...old.data,
                        labels: old.data.labels.map((label) =>
                            label.id === variables.id
                                ? { ...label, ...variables }
                                : label
                        )
                    }
                }
            })
            toast.success('Label updated successfully!', {
                description: 'Your label changes have been saved.'
            })
            onSuccess?.(_data, variables)
        },
        onError
    })
}
