import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { workspaceMemberSearchApi } from '@/lib/api'
import type { WorkspaceMemberSearchResponse } from '@/types'

export function useWorkspaceMemberSearchQuery(
    workspaceId: string,
    search: string,
    enabled = false
): UseQueryResult<WorkspaceMemberSearchResponse, unknown> {
    return useQuery({
        queryKey: ['workspacesSearchUser', workspaceId, search],
        queryFn: () => workspaceMemberSearchApi(workspaceId, search),
        enabled
    })
}
