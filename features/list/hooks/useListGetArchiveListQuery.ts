import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { listGetArchiveListApi } from '@/lib/api'
import type { ListGetArchiveResponse } from '@/types'

export function useListGetArchiveListQuery(
    boardId: string,
    page = 1,
    pageSize = 10,
    query = '',
    enabled = true
): UseQueryResult<ListGetArchiveResponse, unknown> {
    return useQuery({
        queryKey: ['lists', 'archived', boardId, page, pageSize, query],
        queryFn: () => listGetArchiveListApi(boardId, page, pageSize, query),
        enabled: !!boardId && enabled
    })
}
