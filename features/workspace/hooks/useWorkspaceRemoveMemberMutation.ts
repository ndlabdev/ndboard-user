import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { workspaceRemoveMemberApi } from '@/lib/api'
import type { WorkspaceMemberRemoveResponse } from '@/types'

export function useWorkspaceRemoveMemberMutation(
    workspaceId: string,
    onSuccess?: (_data: WorkspaceMemberRemoveResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<WorkspaceMemberRemoveResponse, unknown, string, unknown> {
    return useMutation({
        mutationFn: (userId: string) =>
            workspaceRemoveMemberApi(workspaceId, userId),
        onSuccess,
        onError
    })
}
