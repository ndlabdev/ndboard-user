import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { listGetListApi } from '@/lib/api'
import type { ListGetListResponse } from '@/types'

export function useListGetListQuery(boardId: string): UseQueryResult<ListGetListResponse, unknown> {
    return useQuery({
        queryKey: ['list', boardId],
        queryFn: () => listGetListApi(boardId)
    })
}
