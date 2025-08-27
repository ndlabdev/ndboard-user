import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { cardCreateApi } from '@/lib/api'
import type { CalendarViewBoardResponse, CardCreateResponse } from '@/types'
import type { CardCreateFormValues } from '@/features/card'
import { toast } from 'sonner'

export function useCardCreateMutation(
    onSuccess?: (_data: CardCreateResponse) => void
): UseMutationResult<CardCreateResponse, unknown, CardCreateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<CardCreateResponse, unknown, CardCreateFormValues>({
        mutationFn: cardCreateApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['board-calendar', data.data.boardId], (old: CalendarViewBoardResponse) => {
                if (!old) return old

                return {
                    ...old,
                    data: [...old.data, {
                        id: data.data.id,
                        name: data.data.name,
                        listId: data.data.listId,
                        listName: data.data.listName ?? '',
                        startDate: data.data.startDate,
                        dueDate: data.data.dueDate,
                        labels: data.data.labels ?? [],
                        assignees: data.data.assignees ?? []
                    }]
                }
            })
            toast.success(`Created card "${data.data.name}" successfully`)
            onSuccess?.(data)
        },
        onError: (error) => {
            const msg =
                (error as { message?: string })?.message ||
                'Create Board Failed'

            toast.error(msg)
        }
    })
}
