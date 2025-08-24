import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardFavoriteApi } from '@/lib/api'
import type { BoardDetailResponse, BoardFavoriteResponse, BoardListResponse } from '@/types'
import type { BoardFavoriteFormValues } from '@/features/board'

export function useBoardFavoriteMutation(): UseMutationResult<BoardFavoriteResponse, unknown, BoardFavoriteFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardFavoriteResponse, unknown, BoardFavoriteFormValues>({
        mutationFn: boardFavoriteApi,
        onSuccess: (_data, variables) => {
            // ✅ Update board list cache (workspace level)
            queryClient.setQueryData(
                ['boards', _data.data.workspaceId],
                (old: BoardListResponse) =>
                    old
                        ? {
                            ...old,
                            data: old.data.map((b) =>
                                b.id === _data.data.boardId ? { ...b, isFavorite: _data.data.isFavorite } : b
                            )
                        }
                        : old
            )

            queryClient.setQueryData(['boards', variables.shortLink], (old: BoardDetailResponse) => ({
                ...old,
                data: {
                    ...old.data,
                    isFavorite: true
                }
            }))
        }
    })
}
