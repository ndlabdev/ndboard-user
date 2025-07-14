import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardBulkReorderApi } from '@/lib/api'
import type { CardBulkReorderFormValues } from '@/features/card'

export function useCardBulkReorderMutation(
    onSuccess?: () => void,
    onError?: (_error: unknown) => void
): UseMutationResult<unknown, unknown, CardBulkReorderFormValues, unknown> {
    return useMutation<unknown, unknown, CardBulkReorderFormValues>({
        mutationFn: cardBulkReorderApi,
        onSuccess,
        onError
    })
}
