import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { workspaceEditApi } from '@/lib/api'
import type { WorkspaceEditResponse } from '@/types'
import type { WorkspaceEditFormValues } from '@/features/workspace'

export function useWorkspaceEditMutation(
    onSuccess?: (_data: WorkspaceEditResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<WorkspaceEditResponse, unknown, WorkspaceEditFormValues, unknown> {
    return useMutation<WorkspaceEditResponse, unknown, WorkspaceEditFormValues>({
        mutationFn: workspaceEditApi,
        onSuccess,
        onError
    })
}
