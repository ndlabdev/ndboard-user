import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { boardCreateApi } from '@/lib/api'
import type { BoardCreateResponse, BoardListResponse } from '@/types'
import type { BoardCreateFormValues } from '@/features/board'
import { toast } from 'sonner'

export function useBoardCreateMutation(
    onSuccess?: (_data: BoardCreateResponse) => void
): UseMutationResult<BoardCreateResponse, unknown, BoardCreateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<BoardCreateResponse, unknown, BoardCreateFormValues>({
        mutationFn: boardCreateApi,
        onSuccess: (data) => {
            // ✅ Update cache in-place
            queryClient.setQueryData(
                ['boards', data.data.workspaceId],
                (old: BoardListResponse) => {
                    if (!old) {
                        return {
                            data: [data.data],
                            meta: {
                                total: 1,
                                page: 1,
                                pageSize: 100,
                                totalPages: 1
                            }
                        }
                    }

                    return {
                        ...old,
                        data: [data.data, ...old.data],
                        meta: {
                            ...old.meta,
                            total: old.meta.total + 1,
                            totalPages: Math.ceil((old.meta.total + 1) / old.meta.pageSize)
                        }
                    }
                }
            )

            toast.success('Board Created Successfully', {
                description: 'Your new board is ready. Start organizing your tasks and collaborate with your team.'
            })

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
