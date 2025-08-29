import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { userWorkspaceListApi } from '@/lib/api'
import type { UserWorkspaceList } from '@/types'

export function useUserWorkspaceListQuery(): UseQueryResult<UserWorkspaceList, unknown> {
    return useQuery({
        queryKey: ['user-workspaces'],
        queryFn: userWorkspaceListApi
    })
}
