import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { boardDetailApi } from '@/lib/api'
import type { BoardsDetailResponse } from '@/types'

export function useBoardDetailQuery(shortLink: string): UseQueryResult<BoardsDetailResponse, unknown> {
    return useQuery({
        queryKey: ['boards', shortLink],
        queryFn: () => boardDetailApi(shortLink)
    })
}
