import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardCreateBoardCustomFieldApi } from '@/lib/api'
import type { BoardCreateCustomFieldResponse, BoardCustomFieldListResponse, BoardDetailResponse, CardGetListResponse } from '@/types'
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
            queryClient.setQueryData(
                ['boards', shortLink],
                (old: BoardDetailResponse | undefined) => {
                    if (!old) return old

                    return {
                        ...old,
                        data: {
                            ...old.data,
                            customFields: [...old.data.customFields, _data.data]
                        }
                    }
                }
            )
            queryClient.setQueriesData(
                { queryKey: ['cards'] },
                (old: CardGetListResponse | undefined) => {
                    if (!old) return old

                    return {
                        ...old,
                        data: old.data.map((card) => ({
                            ...card,
                            customFields: card.customFields
                                ? [
                                    {
                                        id: _data.data.id,
                                        name: _data.data.name,
                                        type: _data.data.type,
                                        options: _data.data.options,
                                        showOnCard: _data.data.showOnCard,
                                        value: '' // new fields always empty on existing cards
                                    },
                                    ...card.customFields
                                ]
                                : []
                        }))
                    }
                }
            )
            onSuccess?.(_data, variables)
        },
        onError
    })
}
