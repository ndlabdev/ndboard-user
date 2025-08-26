import { apiFetch } from '@/lib/fetcher'
import type { CalendarViewBoardResponse } from '@/types'

export function calendarViewBoardApi(boardId: string): Promise<CalendarViewBoardResponse> {
    return apiFetch<CalendarViewBoardResponse>(`/calendar/${boardId}`)
}
