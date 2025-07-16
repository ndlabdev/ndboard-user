import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { boardUnFavoriteApi } from '@/lib/api'
import type { BoardFavoriteResponse } from '@/types'
import type { BoardFavoriteFormValues } from '@/features/board'

export function useBoardUnFavoriteMutation(
    onSuccess?: (_data: BoardFavoriteResponse, _variables: BoardFavoriteFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<BoardFavoriteResponse, unknown, BoardFavoriteFormValues, unknown> {
    return useMutation<BoardFavoriteResponse, unknown, BoardFavoriteFormValues>({
        mutationFn: boardUnFavoriteApi,
        onSuccess,
        onError
    })
}
