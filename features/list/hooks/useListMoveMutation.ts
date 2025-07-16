import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { listMoveApi } from '@/lib/api'
import type { ListMoveResponse } from '@/types'
import type { ListMoveFormValues } from '@/features/list'

export function useListMoveMutation(
    onSuccess?: (_data: ListMoveResponse, _variables: ListMoveFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<ListMoveResponse, unknown, ListMoveFormValues, unknown> {
    return useMutation<ListMoveResponse, unknown, ListMoveFormValues>({
        mutationFn: listMoveApi,
        onSuccess,
        onError
    })
}
