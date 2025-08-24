import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { workspaceCreateApi } from '@/lib/api'
import type { WorkspaceCreateResponse, WorkspaceListResponse } from '@/types'
import type { WorkspaceCreateFormValues } from '@/features/workspace'
import { toast } from 'sonner'

export function useWorkspaceCreateMutation(
    onSuccess?: (_data: WorkspaceCreateResponse) => void
): UseMutationResult<WorkspaceCreateResponse, unknown, WorkspaceCreateFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<WorkspaceCreateResponse, unknown, WorkspaceCreateFormValues>({
        mutationFn: workspaceCreateApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['workspaces'], (old: WorkspaceListResponse) => {
                if (!old) {
                    return {
                        data: [data.data],
                        meta: {
                            total: 1,
                            page: 1,
                            pageSize: 30,
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
            })

            toast.success('Workspace Created Successfully', {
                description: 'Your new workspace has been created.'
            })

            onSuccess?.(data)
        },
        onError: (error) => {
            const msg =
                (error as { message?: string })?.message ||
                'Create Workspace Failed'

            toast.error(msg)
        }
    })
}
