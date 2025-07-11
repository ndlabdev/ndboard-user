import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { listCreateApi } from '@/lib/api'
import type { ListCreateResponse } from '@/types'
import type { ListCreateFormValues } from '@/features/list'

export function useListCreateMutation(
    onSuccess?: (_data: ListCreateResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<ListCreateResponse, unknown, ListCreateFormValues, unknown> {
    return useMutation<ListCreateResponse, unknown, ListCreateFormValues>({
        mutationFn: listCreateApi,
        onSuccess,
        onError
    })
}
