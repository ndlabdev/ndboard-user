import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { workspaceTransferOwnerApi } from '@/lib/api'
import type { WorkspaceTransferOwnerResponse, WorkspaceListResponse } from '@/types'
import { WORKSPACE_ROLES, type WorkspaceTransferOwnerFormValues } from '@/features/workspace'
import { toast } from 'sonner'

export function useWorkspaceTransferOwnerMutation(
    onSuccess?: (_data: WorkspaceTransferOwnerResponse) => void
): UseMutationResult<WorkspaceTransferOwnerResponse, unknown, WorkspaceTransferOwnerFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<WorkspaceTransferOwnerResponse, unknown, WorkspaceTransferOwnerFormValues>({
        mutationFn: workspaceTransferOwnerApi,
        onSuccess: (data) => {
            // ✅ Update cache in-place
            queryClient.setQueryData(['workspaces'], (old: WorkspaceListResponse | undefined) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((w) => {
                        if (w.id !== data.data.workspaceId) return w

                        return {
                            ...w,
                            ownerId: data.data.newOwnerId,
                            members: w.members.map((m) => {
                                if (m.id === data.data.oldOwnerId) {
                                    return { ...m, role: WORKSPACE_ROLES.ADMIN }
                                }
                                if (m.id === data.data.newOwnerId) {
                                    return { ...m, role: WORKSPACE_ROLES.OWNER }
                                }

                                return m
                            })
                        }
                    })
                }
            })

            toast.success('Transfer Ownership Successfully', {
                description: `Ownership transferred to ${data.data.newOwnerName ?? 'new owner'}.`
            })

            onSuccess?.(data)
        },
        onError: (error) => {
            const msg =
                (error as { message?: string })?.message ||
                'Transfer Ownership Failed'

            toast.error(msg)
        }
    })
}
