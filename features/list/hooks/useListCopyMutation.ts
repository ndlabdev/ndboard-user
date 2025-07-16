import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { listCopyApi } from '@/lib/api'
import type { ListCopyResponse } from '@/types'
import type { ListCopyFormValues } from '@/features/list'

export function useListCopyMutation(
    onSuccess?: (_data: ListCopyResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<ListCopyResponse, unknown, ListCopyFormValues, unknown> {
    return useMutation<ListCopyResponse, unknown, ListCopyFormValues>({
        mutationFn: listCopyApi,
        onSuccess,
        onError
    })
}
