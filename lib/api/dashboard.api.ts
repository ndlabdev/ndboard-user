import { apiFetch } from '@/lib/fetcher'
import type { DashboardViewBoardResponse } from '@/types'

export function dashboardViewBoardApi(boardId: string): Promise<DashboardViewBoardResponse> {
    return apiFetch<DashboardViewBoardResponse>(`/dashboard/${boardId}`)
}
