import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardCreateBoardCustomFieldApi } from '@/lib/api'
import type { BoardCreateCustomFieldResponse, BoardCustomFieldListResponse } from '@/types'
import type { BoardCreateCustomFieldFormValues } from '@/features/board'

export function useBoardCreateCustomFieldMutation(
    shortLink: string,
    onSuccess?: (_data: unknown, _variables: BoardCreateCustomFieldFormValues) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<BoardCreateCustomFieldResponse, unknown, BoardCreateCustomFieldFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardCreateCustomFieldResponse, unknown, BoardCreateCustomFieldFormValues>({
        mutationFn: (body) => boardCreateBoardCustomFieldApi(shortLink, body),
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(
                ['boardCustomFields', shortLink],
                (old: BoardCustomFieldListResponse) => {
                    if (!old) {
                        return old
                    }

                    return {
                        ...old,
                        data: [_data.data, ...old.data]
                    }
                }
            )
            onSuccess?.(_data, variables)
        },
        onError
    })
}
