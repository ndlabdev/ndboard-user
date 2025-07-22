import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardUpdateApi } from '@/lib/api'
import type { BoardDetailResponse, BoardUpdateResponse } from '@/types'
import type { BoardUpdateFormValues } from '@/features/board'

export function useBoardUpdateMutation(): UseMutationResult<BoardUpdateResponse, unknown, BoardUpdateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardUpdateResponse, unknown, BoardUpdateFormValues>({
        mutationFn: boardUpdateApi,
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(['boards', variables.shortLink], (old: BoardDetailResponse) => ({
                ...old,
                data: {
                    ...old.data,
                    ...variables.name && { name: variables.name },
                    ...variables.visibility && { visibility: variables.visibility }
                }
            }))
        }
    })
}
