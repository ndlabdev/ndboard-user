import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardUpdateApi } from '@/lib/api'
import type { BoardCardsResponse, CardGetListResponse, CardUpdateResponse, CalendarViewBoardResponse } from '@/types'
import type { CardUpdateFormValues } from '@/features/card'

export function useCardUpdateMutation(
    onSuccess?: (_data: CardUpdateResponse) => void
): UseMutationResult<CardUpdateResponse, unknown, CardUpdateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardUpdateResponse, unknown, CardUpdateFormValues>({
        mutationFn: cardUpdateApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['cards', data.data.id], (old: { data: BoardCardsResponse } | undefined) => {
                if (!old) return old

                return {
                    data: {
                        ...old.data,
                        ...data.data
                    }
                }
            })

            queryClient.setQueryData(['cards', data.data.listId], (old: CardGetListResponse | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((card) =>
                        card.id === data.data.id
                            ? {
                                ...card,
                                ...data.data
                            }
                            : card
                    )
                }
            })

            queryClient.setQueryData(['board-calendar', data.data.boardId], (old: CalendarViewBoardResponse) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((c) =>
                        c.id === data.data.id
                            ? {
                                ...c,
                                name: data.data.name,
                                listName: data.data.listName,
                                startDate: data.data.startDate,
                                dueDate: data.data.dueDate,
                                labels: data.data.labels?.map((l) => ({
                                    id: l.id,
                                    name: l.name,
                                    color: l.color,
                                    tone: l.tone ?? 'normal'
                                })),
                                assignees: data.data.assignees?.map((a) => ({
                                    id: a.id,
                                    name: a.name,
                                    avatarUrl: a.avatarUrl
                                }))
                            }
                            : c
                    )
                }
            })
            onSuccess?.(data)
        }
    })
}
