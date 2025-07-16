import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { listMoveAllCardsApi } from '@/lib/api'
import type { ListMoveAllCardsFormValues } from '@/features/list'

export function useListMoveAllCardsMutation(
    onSuccess?: (_data: unknown, _variables: ListMoveAllCardsFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<unknown, unknown, ListMoveAllCardsFormValues, unknown> {
    return useMutation<unknown, unknown, ListMoveAllCardsFormValues>({
        mutationFn: listMoveAllCardsApi,
        onSuccess,
        onError
    })
}
