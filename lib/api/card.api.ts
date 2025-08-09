import { apiFetch } from '@/lib/fetcher'
import type { BoardCardsResponse, CardAddChecklistsResponse, CardCreateResponse, CardUpdateResponse } from '@/types'
import { CardCreateFormValues, CardReorderFormValues, CardBulkReorderFormValues, CardUpdateFormValues } from '@/features/card'
import { CardAddChecklistsFormValues } from '@/features/card/schemas/add-checklists'

export function cardGetListApi(listId: string): Promise<{ data: BoardCardsResponse[] }> {
    return apiFetch<{ data: BoardCardsResponse[] }>(`/cards/l/${listId}`)
}

export function cardCreateApi(payload: CardCreateFormValues): Promise<CardCreateResponse> {
    return apiFetch<CardCreateResponse>('/cards', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function cardReorderApi(payload: CardReorderFormValues) {
    return apiFetch<CardReorderFormValues>('/cards/reorder', {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

export function cardBulkReorderApi(payload: CardBulkReorderFormValues) {
    return apiFetch<CardBulkReorderFormValues>('/cards/bulk-reorder', {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

export function cardGetArchiveListApi(
    boardId: string,
    page = 1,
    pageSize = 10,
    q = ''
): Promise<BoardCardsResponse> {
    return apiFetch<BoardCardsResponse>('/cards/archived', {
        query: {
            boardId,
            page,
            pageSize,
            q
        }
    })
}

export function cardRestoreApi(payload: { id: string }): Promise<CardCreateResponse> {
    return apiFetch(`/cards/${payload.id}/restore`, {
        method: 'PATCH'
    })
}

export function cardDeleteApi(payload: { id: string }): Promise<CardCreateResponse> {
    return apiFetch(`/cards/${payload.id}`, {
        method: 'DELETE'
    })
}

export function cardUpdateApi(payload: CardUpdateFormValues): Promise<CardUpdateResponse> {
    return apiFetch<CardUpdateResponse>(`/cards/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

export function cardAddChecklistsApi(payload: CardAddChecklistsFormValues): Promise<CardAddChecklistsResponse> {
    return apiFetch<CardAddChecklistsResponse>(`/cards/${payload.id}/checklists`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}
