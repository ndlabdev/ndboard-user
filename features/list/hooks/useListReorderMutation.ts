import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { listReorderApi } from '@/lib/api'
import type { ListReorderFormValues } from '@/features/list'

export function useListReorderMutation(
    onSuccess?: () => void,
    onError?: (_error: unknown) => void
): UseMutationResult<unknown, unknown, ListReorderFormValues, unknown> {
    return useMutation<unknown, unknown, ListReorderFormValues>({
        mutationFn: listReorderApi,
        onSuccess,
        onError
    })
}
