import { useMutation, useQueryClient } from '@tanstack/react-query'
import { listArchiveAllCardsApi } from '@/lib/api'

export function useListArchiveAllCardsMutation(
    onSuccess?: (_data: unknown) => void,
    onError?: (_error: unknown) => void
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: listArchiveAllCardsApi,
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['cards', variables.id], { data: [] })
            onSuccess?.(data)
        },
        onError
    })
}
