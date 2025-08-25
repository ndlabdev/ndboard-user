import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { DashboardViewBoardResponse } from '@/types'
import { dashboardViewBoardApi } from '@/lib/api'

export function useDashboardViewBoardQuery(
    boardId: string
): UseQueryResult<DashboardViewBoardResponse, unknown> {
    return useQuery({
        queryKey: ['board-dashboard', boardId],
        queryFn: () => dashboardViewBoardApi(boardId)
    })
}
