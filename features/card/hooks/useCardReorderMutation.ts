import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardReorderApi } from '@/lib/api'
import type { CardReorderFormValues } from '@/features/card'

export function useCardReorderMutation(
    onSuccess?: () => void,
    onError?: (_error: unknown) => void
): UseMutationResult<unknown, unknown, CardReorderFormValues, unknown> {
    return useMutation<unknown, unknown, CardReorderFormValues>({
        mutationFn: cardReorderApi,
        onSuccess,
        onError
    })
}
