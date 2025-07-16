import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { boardUpdateApi } from '@/lib/api'
import type { BoardUpdateResponse } from '@/types'
import type { BoardUpdateFormValues } from '@/features/board'

export function useBoardUpdateMutation(
    onSuccess?: (_data: BoardUpdateResponse, _variables: BoardUpdateFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<BoardUpdateResponse, unknown, BoardUpdateFormValues, unknown> {
    return useMutation<BoardUpdateResponse, unknown, BoardUpdateFormValues>({
        mutationFn: boardUpdateApi,
        onSuccess,
        onError
    })
}
