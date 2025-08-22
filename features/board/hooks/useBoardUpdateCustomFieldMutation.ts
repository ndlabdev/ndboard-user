import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardUpdateBoardCustomFieldApi } from '@/lib/api'
import type { BoardCreateCustomFieldResponse, BoardCustomFieldListResponse } from '@/types'
import type { BoardCreateCustomFieldFormValues } from '@/features/board'

export function useBoardUpdateCustomFieldMutation(
    shortLink: string,
    onSuccess?: (_data: unknown, _variables: BoardCreateCustomFieldFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<
    BoardCreateCustomFieldResponse,
    unknown,
    BoardCreateCustomFieldFormValues,
    unknown
> {
    const queryClient = useQueryClient()

    return useMutation<
        BoardCreateCustomFieldResponse,
        unknown,
        BoardCreateCustomFieldFormValues
    >({
        mutationFn: (body) => boardUpdateBoardCustomFieldApi(shortLink, body),
        onSuccess: (_data, variables) => {
            // update cache
            queryClient.setQueryData(
                ['boardCustomFields', shortLink],
                (old: BoardCustomFieldListResponse | undefined) => {
                    if (!old || !('data' in old)) return old

                    return {
                        ...old,
                        data: old.data.map((f) =>
                            f.id === _data.data.id ? _data.data : f
                        )
                    }
                }
            )
            onSuccess?.(_data, variables)
        },
        onError
    })
}
