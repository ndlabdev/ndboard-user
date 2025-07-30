import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardCreateLabelsApi } from '@/lib/api'
import type { BoardCreateLabelsResponse, BoardDetailResponse } from '@/types'
import type { BoardLabelCreateFormValues } from '@/features/board'
import { toast } from 'sonner'

export function useBoardCreateLabelsMutation(
    shortLink: string,
    onSuccess?: (_data: unknown, _variables: BoardLabelCreateFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<BoardCreateLabelsResponse, unknown, BoardLabelCreateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardCreateLabelsResponse, unknown, BoardLabelCreateFormValues>({
        mutationFn: boardCreateLabelsApi,
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(['boards', shortLink], (old: BoardDetailResponse) => ({
                ...old,
                data: {
                    ...old.data,
                    labels: [...old.data.labels, _data.data]
                }
            }))
            toast.success('Label created successfully!', {
                description: 'A new label has been added to your board. You can now assign it to your cards.'
            })
            onSuccess?.(_data, variables)
        },
        onError
    })
}
