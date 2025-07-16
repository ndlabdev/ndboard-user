import { apiFetch } from '@/lib/fetcher'
import { BoardCreateFormValues, BoardUpdateFormValues } from '@/features/board'
import type { BoardListResponse, BoardDetailResponse, BoardCreateResponse, BoardUpdateResponse } from '@/types'

export function boardGetListApi(workspaceId: string): Promise<BoardListResponse> {
    return apiFetch<BoardListResponse>('/boards', {
        query: {
            workspaceId,
            pageSize: 30
        }
    })
}

export function boardDetailApi(shortLink: string): Promise<BoardDetailResponse> {
    return apiFetch<BoardDetailResponse>(`/boards/${shortLink}`)
}

export function boardCreateApi(payload: BoardCreateFormValues): Promise<BoardCreateResponse> {
    return apiFetch<BoardCreateResponse>('/boards', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function boardUpdateApi(payload: BoardUpdateFormValues): Promise<BoardUpdateResponse> {
    return apiFetch<BoardUpdateResponse>(`/boards/${payload.shortLink}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}
