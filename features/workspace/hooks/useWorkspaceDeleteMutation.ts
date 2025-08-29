import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { workspaceDeleteApi } from '@/lib/api/workspace.api'
import type { WorkspaceDeleteResponse, WorkspaceListResponse } from '@/types'
import { toast } from 'sonner'

export function useWorkspaceDeleteMutation(
    onSuccess?: (_data: WorkspaceDeleteResponse) => void
): UseMutationResult<WorkspaceDeleteResponse, unknown, string, unknown> {
    const queryClient = useQueryClient()

    return useMutation<WorkspaceDeleteResponse, unknown, string>({
        mutationFn: workspaceDeleteApi,
        onSuccess: (data, workspaceId) => {
            // ✅ Remove deleted workspace from cache
            queryClient.setQueryData(['workspaces'], (old: WorkspaceListResponse | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.filter((w) => w.id !== workspaceId)
                }
            })

            toast.success('Workspace Deleted', {
                description: `Workspace "${data.data.name}" has been deleted.`
            })

            onSuccess?.(data)
        },
        onError: (error) => {
            const msg = (error as { message?: string })?.message || 'Delete Workspace Failed'
            toast.error(msg)
        }
    })
}
