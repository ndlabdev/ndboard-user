import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { workspaceCreateApi } from '@/lib/api'
import type { WorkspaceCreateResponse } from '@/types'
import type { WorkspaceCreateFormValues } from '@/features/workspace'

export function useWorkspaceCreateMutation(
    onSuccess?: (_data: WorkspaceCreateResponse) => void,
    onError?: (_error: unknown) => void
): UseMutationResult<WorkspaceCreateResponse, unknown, WorkspaceCreateFormValues, unknown> {
    return useMutation<WorkspaceCreateResponse, unknown, WorkspaceCreateFormValues>({
        mutationFn: workspaceCreateApi,
        onSuccess,
        onError
    })
}
