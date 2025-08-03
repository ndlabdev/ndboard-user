import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { cardGetArchiveListApi } from '@/lib/api'
import type { ListGetArchiveResponse } from '@/types'

export function useCardGetArchiveListQuery(
    boardId: string,
    page = 1,
    pageSize = 10,
    query = '',
    enabled = true
): UseQueryResult<ListGetArchiveResponse, unknown> {
    return useQuery({
        queryKey: ['cards', 'archived', boardId, page, pageSize, query],
        queryFn: () => cardGetArchiveListApi(boardId, page, pageSize, query),
        enabled: !!boardId && enabled
    })
}
