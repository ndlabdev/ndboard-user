import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { boardCreateApi } from '@/lib/api'
import type { BoardCreateResponse } from '@/types'
import type { BoardCreateFormValues } from '@/features/board'

export function useBoardCreateMutation(
    onSuccess?: (_data: BoardCreateResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<BoardCreateResponse, unknown, BoardCreateFormValues, unknown> {
    return useMutation<BoardCreateResponse, unknown, BoardCreateFormValues>({
        mutationFn: boardCreateApi,
        onSuccess,
        onError
    })
}
