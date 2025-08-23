import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardUpdateBoardCustomFieldApi } from '@/lib/api'
import type { BoardCreateCustomFieldResponse, BoardCustomFieldListResponse, BoardDetailResponse, CardGetListResponse } from '@/types'
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
            queryClient.setQueryData(
                ['boards', shortLink],
                (old: BoardDetailResponse | undefined) => {
                    if (!old) return old

                    return {
                        ...old,
                        data: {
                            ...old.data,
                            customFields: old.data.customFields.map((cf) => {
                                return cf.id === _data.data.id
                                    ? _data.data
                                    : cf
                            })
                        }
                    }
                }
            )
            // update cache for cards
            queryClient.setQueriesData(
                { queryKey: ['cards'] },
                (old: CardGetListResponse | undefined) => {
                    if (!old) return old

                    return {
                        ...old,
                        data: old.data.map((card) => {
                            if (card.customFields) {
                                return {
                                    ...card,
                                    customFields: card.customFields.map((cf) => {
                                        return cf.id === _data.data.id
                                            ? {
                                                ...cf,
                                                value: cf.value,
                                                name: _data.data.name,
                                                type: _data.data.type,
                                                options: _data.data.options,
                                                showOnCard: _data.data.showOnCard
                                            }
                                            : cf
                                    })
                                }
                            }

                            return card
                        })
                    }
                }
            )
            onSuccess?.(_data, variables)
        },
        onError
    })
}
