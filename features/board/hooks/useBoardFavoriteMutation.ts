import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardFavoriteApi } from '@/lib/api'
import type { BoardDetailResponse, BoardFavoriteResponse } from '@/types'
import type { BoardFavoriteFormValues } from '@/features/board'

export function useBoardFavoriteMutation(): UseMutationResult<BoardFavoriteResponse, unknown, BoardFavoriteFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardFavoriteResponse, unknown, BoardFavoriteFormValues>({
        mutationFn: boardFavoriteApi,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['boards', _data.data.workspaceId] })
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
