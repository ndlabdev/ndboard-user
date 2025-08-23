import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardDeleteBoardCustomFieldApi } from '@/lib/api'
import type { BoardCustomFieldListResponse, BoardDeleteCustomFieldResponse, BoardDetailResponse, CardGetListResponse } from '@/types'

export function useBoardDeleteCustomFieldMutation(
    shortLink: string,
    onSuccess?: (_id: string) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<BoardDeleteCustomFieldResponse, unknown, string, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardDeleteCustomFieldResponse, unknown, string>({
        mutationFn: (fieldId: string) => boardDeleteBoardCustomFieldApi(shortLink, fieldId),
        onSuccess: (data, fieldId) => {
            // Update cache: remove deleted field
            queryClient.setQueryData<BoardCustomFieldListResponse>(
                ['boardCustomFields', shortLink],
                (old) => {
                    if (!old) return old

                    return {
                        ...old,
                        data: old.data.filter((f) => f.id !== fieldId)
                    }
                }
            )
            // 2. Update board detail cache
            queryClient.setQueryData<BoardDetailResponse>(
                ['boards', shortLink],
                (old) => {
                    if (!old) return old

                    return {
                        ...old,
                        data: {
                            ...old.data,
                            customFields: old.data.customFields.filter((cf) => cf.id !== fieldId)
                        }
                    }
                }
            )

            // 3. Update cards cache (remove field from each card.customFields)
            queryClient.setQueriesData<CardGetListResponse>(
                { queryKey: ['cards'] },
                (old) => {
                    if (!old) return old

                    return {
                        ...old,
                        data: old.data.map((card) => ({
                            ...card,
                            customFields: card.customFields
                                ? card.customFields.filter((cf) => cf.id !== fieldId)
                                : []
                        }))
                    }
                }
            )
            onSuccess?.(fieldId)
        },
        onError
    })
}
