import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { boardFavoriteApi } from '@/lib/api'
import type { BoardFavoriteResponse } from '@/types'
import type { BoardFavoriteFormValues } from '@/features/board'

export function useBoardFavoriteMutation(
    onSuccess?: (_data: BoardFavoriteResponse, _variables: BoardFavoriteFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<BoardFavoriteResponse, unknown, BoardFavoriteFormValues, unknown> {
    return useMutation<BoardFavoriteResponse, unknown, BoardFavoriteFormValues>({
        mutationFn: boardFavoriteApi,
        onSuccess,
        onError
    })
}
