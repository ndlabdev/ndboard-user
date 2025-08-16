import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { workspaceInviteMemberApi } from '@/lib/api'
import type { WorkspaceInviteMemberResponse } from '@/types'
import type { WorkspaceInviteMemberFormValues } from '@/features/workspace'

export function useWorkspaceInviteMemberMutation(
    workspaceId: string,
    onSuccess?: (_data: WorkspaceInviteMemberResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<WorkspaceInviteMemberResponse, unknown, WorkspaceInviteMemberFormValues, unknown> {
    const queryClient = useQueryClient()

    return useMutation<WorkspaceInviteMemberResponse, unknown, WorkspaceInviteMemberFormValues>({
        mutationFn: (body) => workspaceInviteMemberApi(workspaceId, body),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['workspacesMember', workspaceId]
            })
            if (onSuccess) onSuccess(data)
        },
        onError
    })
}
