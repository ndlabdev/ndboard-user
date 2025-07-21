import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { listMoveAllCardsApi } from '@/lib/api'
import type { ListMoveAllCardsFormValues } from '@/features/list'

export function useListMoveAllCardsMutation(
    onSuccess?: (_data: unknown, _variables: ListMoveAllCardsFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<unknown, unknown, ListMoveAllCardsFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<unknown, unknown, ListMoveAllCardsFormValues>({
        mutationFn: listMoveAllCardsApi,
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(['cards', variables.id], { data: [] })
            queryClient.invalidateQueries({ queryKey: ['cards', variables.targetListId] })
            onSuccess?.(_data, variables)
        },
        onError
    })
}
