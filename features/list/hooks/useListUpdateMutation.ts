import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { listUpdateApi } from '@/lib/api'
import type { ListUpdateResponse } from '@/types'
import type { ListUpdateFormValues } from '@/features/list'

export function useListUpdateMutation(
    onSuccess?: (_data: ListUpdateResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<ListUpdateResponse, unknown, ListUpdateFormValues, unknown> {
    return useMutation<ListUpdateResponse, unknown, ListUpdateFormValues>({
        mutationFn: listUpdateApi,
        onSuccess,
        onError
    })
}
