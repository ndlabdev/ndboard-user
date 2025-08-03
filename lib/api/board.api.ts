import { apiFetch } from '@/lib/fetcher'
import { BoardCreateFormValues, BoardFavoriteFormValues, BoardLabelCreateFormValues, BoardUpdateFormValues } from '@/features/board'
import type { BoardListResponse, BoardDetailResponse, BoardCreateResponse, BoardUpdateResponse, BoardFavoriteResponse, BoardCreateLabelsResponse } from '@/types'

export function boardGetListApi(workspaceId: string, isStarred = false): Promise<BoardListResponse> {
    return apiFetch<BoardListResponse>('/boards', {
        query: {
            workspaceId,
            pageSize: 30,
            ...(isStarred ? {
                isStarred: true
            } : {})
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

export function boardFavoriteApi(payload: BoardFavoriteFormValues): Promise<BoardFavoriteResponse> {
    return apiFetch<BoardFavoriteResponse>(`/boards/${payload.shortLink}/favorite`, {
        method: 'POST'
    })
}

export function boardUnFavoriteApi(payload: BoardFavoriteFormValues): Promise<BoardFavoriteResponse> {
    return apiFetch<BoardFavoriteResponse>(`/boards/${payload.shortLink}/favorite`, {
        method: 'DELETE'
    })
}

export function boardCreateLabelsApi(payload: BoardLabelCreateFormValues): Promise<BoardCreateLabelsResponse> {
    return apiFetch<BoardCreateLabelsResponse>('/boards/labels', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function boardUpdateLabelApi(payload: BoardLabelCreateFormValues): Promise<BoardCreateLabelsResponse> {
    return apiFetch<BoardCreateLabelsResponse>('/boards/labels', {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}
