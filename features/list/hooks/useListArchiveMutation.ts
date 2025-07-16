import { useMutation } from '@tanstack/react-query'
import { listArchiveApi } from '@/lib/api'

export function useListArchiveMutation(
    onSuccess?: (_data: unknown) => void,
    onError?: (_error: unknown) => void
) {
    return useMutation({
        mutationFn: listArchiveApi,
        onSuccess,
        onError
    })
}
