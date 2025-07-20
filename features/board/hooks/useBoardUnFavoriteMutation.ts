import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardUnFavoriteApi } from '@/lib/api'
import type { BoardDetailResponse, BoardFavoriteResponse } from '@/types'
import type { BoardFavoriteFormValues } from '@/features/board'

export function useBoardUnFavoriteMutation(): UseMutationResult<BoardFavoriteResponse, unknown, BoardFavoriteFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardFavoriteResponse, unknown, BoardFavoriteFormValues>({
        mutationFn: boardUnFavoriteApi,
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(['boards', variables.shortLink], (old: BoardDetailResponse) => ({
                ...old,
                data: {
                    ...old.data,
                    isFavorite: false
                }
            }))
        }
    })
}
