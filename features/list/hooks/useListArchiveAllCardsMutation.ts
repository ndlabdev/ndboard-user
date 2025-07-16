import { useMutation } from '@tanstack/react-query'
import { listArchiveAllCardsApi } from '@/lib/api'

export function useListArchiveAllCardsMutation(
    onSuccess?: (_data: unknown) => void,
    onError?: (_error: unknown) => void
) {
    return useMutation({
        mutationFn: listArchiveAllCardsApi,
        onSuccess,
        onError
    })
}
