import { apiFetch } from '@/lib/fetcher'
import type { BoardCardsResponse, CardCreateResponse } from '@/types'
import { CardCreateFormValues, CardReorderFormValues, CardBulkReorderFormValues } from '@/features/card'

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
