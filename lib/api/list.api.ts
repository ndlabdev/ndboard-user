import { apiFetch } from '@/lib/fetcher'
import type { ListGetListResponse, ListCreateResponse, ListUpdateResponse, ListCopyResponse, ListMoveResponse, BoardListsResponse } from '@/types'
import { ListReorderFormValues, ListCreateFormValues, ListUpdateFormValues, ListCopyFormValues, ListMoveFormValues } from '@/features/list'
import { ListMoveAllCardsFormValues } from '@/features/list/schemas/moveAllCards'

export function listGetListApi(boardId: string): Promise<ListGetListResponse> {
    return apiFetch<ListGetListResponse>('/lists', {
        query: {
            boardId
        }
    })
}

export function listReorderApi(payload: ListReorderFormValues) {
    return apiFetch<ListReorderFormValues>('/lists/reorder', {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

export function listCreateApi(payload: ListCreateFormValues): Promise<ListCreateResponse> {
    return apiFetch<ListCreateResponse>('/lists', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function listUpdateApi(payload: ListUpdateFormValues): Promise<ListUpdateResponse> {
    return apiFetch<ListUpdateResponse>(`/lists/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

export function listCopyApi(payload: ListCopyFormValues): Promise<ListCopyResponse> {
    return apiFetch<ListCopyResponse>(`/lists/${payload.id}/copy`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function listArchiveApi(payload: { id: string }) {
    return apiFetch(`/lists/${payload.id}/archive`, {
        method: 'PATCH'
    })
}

export function listRestoreApi(payload: { id: string, index: number }): Promise<{ data: BoardListsResponse }> {
    return apiFetch(`/lists/${payload.id}/restore`, {
        method: 'PATCH'
    })
}

export function listArchiveAllCardsApi(payload: { id: string }) {
    return apiFetch(`/lists/${payload.id}/archive-all-cards`, {
        method: 'PATCH'
    })
}

export function listMoveApi(payload: ListMoveFormValues): Promise<ListMoveResponse> {
    return apiFetch<ListMoveResponse>(`/lists/${payload.id}/move`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

export function listMoveAllCardsApi(payload: ListMoveAllCardsFormValues): Promise<ListMoveAllCardsFormValues> {
    return apiFetch<ListMoveAllCardsFormValues>(`/lists/${payload.id}/move-all-cards`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}