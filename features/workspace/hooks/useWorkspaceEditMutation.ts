import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { workspaceEditApi } from '@/lib/api'
import type { WorkspaceEditResponse, WorkspaceListResponse } from '@/types'
import type { WorkspaceEditFormValues } from '@/features/workspace'
import { toast } from 'sonner'

export function useWorkspaceEditMutation(
    onSuccess?: (_data: WorkspaceEditResponse) => void
): UseMutationResult<WorkspaceEditResponse, unknown, WorkspaceEditFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<WorkspaceEditResponse, unknown, WorkspaceEditFormValues>({
        mutationFn: workspaceEditApi,
        onSuccess: (data) => {
            // ✅ Update cache in-place
            queryClient.setQueryData(['workspaces'], (old: WorkspaceListResponse | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((w) =>
                        w.id === data.data.id
                            ? { ...w, ...data.data }
                            : w
                    )
                }
            })

            toast.success('Workspace Updated Successfully', {
                description: 'Your workspace changes have been saved.'
            })

            onSuccess?.(data)
        },
        onError: (error) => {
            const msg =
                (error as { message?: string })?.message ||
                'Update Workspace Failed'

            toast.error(msg)
        }
    })
}
