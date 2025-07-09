import { apiFetch } from '@/lib/fetcher'
import type { BoardListResponse, BoardsDetailResponse } from '@/types'

export function boardGetListApi(workspaceId: string): Promise<BoardListResponse> {
    return apiFetch<BoardListResponse>('/boards', {
        query: {
            workspaceId,
            pageSize: 30
        }
    })
}

export function boardDetailApi(shortLink: string): Promise<BoardsDetailResponse> {
    return apiFetch<BoardsDetailResponse>(`/boards/${shortLink}`)
}
