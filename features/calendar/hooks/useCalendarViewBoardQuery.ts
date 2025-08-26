import { useQuery, UseQueryResult } from '@tanstack/react-query'
import type { CalendarViewBoardResponse } from '@/types'
import { calendarViewBoardApi } from '@/lib/api'

export function useCalendarViewBoardQuery(
    boardId: string
): UseQueryResult<CalendarViewBoardResponse, unknown> {
    return useQuery({
        queryKey: ['board-calendar', boardId],
        queryFn: () => calendarViewBoardApi(boardId)
    })
}
