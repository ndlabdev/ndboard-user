import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { workspaceGetListApi } from '@/lib/api'
import type { WorkspaceListResponse } from '@/types'

export function useWorkspaceGetListQuery(): UseQueryResult<WorkspaceListResponse, unknown> {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: workspaceGetListApi
    })
}
