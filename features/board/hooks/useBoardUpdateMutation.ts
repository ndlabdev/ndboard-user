import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardUpdateApi } from '@/lib/api'
import type { BoardDetailResponse, BoardListResponse, BoardUpdateResponse } from '@/types'
import type { BoardUpdateFormValues } from '@/features/board'

export function useBoardUpdateMutation(workspaceId: string): UseMutationResult<BoardUpdateResponse, unknown, BoardUpdateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardUpdateResponse, unknown, BoardUpdateFormValues>({
        mutationFn: boardUpdateApi,
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(['boards', workspaceId], (old: BoardListResponse | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((board) =>
                        board.id === _data.data.id
                            ? {
                                ...board,
                                ...variables.name && { name: variables.name },
                                ...variables.type && { type: variables.type },
                                ...variables.visibility && { visibility: variables.visibility },
                                ...variables.coverImageUrl && { coverImageUrl: variables.coverImageUrl }
                            }
                            : board
                    )
                }
            })

            queryClient.setQueryData(['boards', variables.shortLink], (old: BoardDetailResponse | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: {
                        ...old.data,
                        ...variables.name && { name: variables.name },
                        ...variables.type && { type: variables.type },
                        ...variables.visibility && { visibility: variables.visibility },
                        ...variables.coverImageUrl && { coverImageUrl: variables.coverImageUrl }
                    }
                }
            })
        }
    })
}
