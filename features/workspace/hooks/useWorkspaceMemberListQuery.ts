import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { workspaceMemberListApi } from '@/lib/api'
import type { WorkspaceMemberListResponse } from '@/types'

export function useWorkspaceMemberListQuery(
    workspaceId: string,
    search: string,
    enabled: boolean
): UseQueryResult<WorkspaceMemberListResponse, unknown> {
    return useQuery({
        queryKey: ['workspacesMember', workspaceId, search],
        queryFn: () => workspaceMemberListApi(workspaceId, search),
        enabled
    })
}
