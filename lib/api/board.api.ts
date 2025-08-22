import { apiFetch } from '@/lib/fetcher'
import { BoardCreateCustomFieldFormValues, BoardCreateFormValues, BoardFavoriteFormValues, BoardLabelCreateFormValues, BoardUpdateFormValues } from '@/features/board'
import type { BoardListResponse, BoardDetailResponse, BoardCreateResponse, BoardUpdateResponse, BoardFavoriteResponse, BoardCreateLabelsResponse, BoardInviteMembersResponse, BoardCreateCustomFieldResponse, BoardCustomFieldListResponse } from '@/types'

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

export async function boardInviteMembersApi(
    shortLink: string,
    body: { userIds: string[]; role?: string }
): Promise<BoardInviteMembersResponse> {
    return apiFetch<BoardInviteMembersResponse>(
        `/boards/${shortLink}/invite-members`,
        {
            method: 'POST',
            body: JSON.stringify(body)
        }
    )
}

export async function boardRemoveMemberApi(shortLink: string, userId: string) {
    return apiFetch<{ data: { success: boolean } }>(
        `/boards/${shortLink}/members/${userId}`,
        {
            method: 'DELETE'
        }
    )
}

export function boardCreateBoardCustomFieldApi(shortLink: string, payload: BoardCreateCustomFieldFormValues): Promise<BoardCreateCustomFieldResponse> {
    return apiFetch<BoardCreateCustomFieldResponse>(`/boards/${shortLink}/custom-fields`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function boardBoardCustomFieldListApi(shortLink: string): Promise<BoardCustomFieldListResponse> {
    return apiFetch<BoardCustomFieldListResponse>(`/boards/${shortLink}/custom-fields`)
}
