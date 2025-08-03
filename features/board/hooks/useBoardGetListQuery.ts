import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { boardGetListApi } from '@/lib/api'
import type { BoardListResponse } from '@/types'

export function useBoardGetListQuery(workspaceId: string, isStarred = false): UseQueryResult<BoardListResponse, unknown> {
    return useQuery({
        queryKey: ['boards', workspaceId, isStarred],
        queryFn: () => boardGetListApi(workspaceId, isStarred)
    })
}
