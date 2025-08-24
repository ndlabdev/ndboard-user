import { apiFetch } from '@/lib/fetcher'
import type { BoardCardsResponse, CardAddChecklistItemResponse, CardAddChecklistsResponse, CardAddCommentResponse, CardCreateResponse, CardDeleteChecklistItemResponse, CardUpdateResponse, ListGetArchiveResponse } from '@/types'
import { CardCreateFormValues, CardReorderFormValues, CardBulkReorderFormValues, CardUpdateFormValues, CardAddChecklistItemFormValues, CardDeleteChecklistFormValues, CardCompleteChecklistItemFormValues, CardRenameChecklistItemFormValues, CardUpdateChecklistFormValues, CardAddCommentFormValues } from '@/features/card'
import { CardAddChecklistsFormValues } from '@/features/card/schemas/add-checklists'
import { CardDeleteChecklistItemFormValues } from '@/features/card/schemas/delete-checklist-item'

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
): Promise<ListGetArchiveResponse> {
    return apiFetch<ListGetArchiveResponse>('/cards/archived', {
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

export function cardAddChecklistItemApi(payload: CardAddChecklistItemFormValues): Promise<CardAddChecklistItemResponse> {
    return apiFetch<CardAddChecklistItemResponse>(`/cards/${payload.id}/checklists/items`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function cardDeleteChecklistItemApi(payload: CardDeleteChecklistItemFormValues): Promise<CardDeleteChecklistItemResponse> {
    return apiFetch<CardDeleteChecklistItemResponse>(`/cards/${payload.id}/checklists/${payload.checklistId}/items/${payload.itemId}`, {
        method: 'DELETE'
    })
}

export function cardDeleteChecklistApi(payload: CardDeleteChecklistFormValues): Promise<CardDeleteChecklistItemResponse> {
    return apiFetch<CardDeleteChecklistItemResponse>(`/cards/${payload.id}/checklists/${payload.checklistId}`, {
        method: 'DELETE'
    })
}

export function cardCompleteChecklistItemApi(payload: CardCompleteChecklistItemFormValues): Promise<CardAddChecklistItemResponse> {
    return apiFetch<CardAddChecklistItemResponse>(`/cards/${payload.id}/checklists/${payload.checklistId}/items/${payload.itemId}/complete`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

export function cardRenameChecklistItemApi(payload: CardRenameChecklistItemFormValues): Promise<CardAddChecklistItemResponse> {
    return apiFetch<CardAddChecklistItemResponse>(`/cards/${payload.id}/checklists/${payload.checklistId}/items/${payload.itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}

export function cardUpdateChecklistApi(payload: CardUpdateChecklistFormValues): Promise<CardAddChecklistsResponse> {
    return apiFetch<CardAddChecklistsResponse>(`/cards/${payload.id}/checklists/${payload.checklistId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}


export function cardAddCommentApi(cardId: string, payload: CardAddCommentFormValues): Promise<CardAddCommentResponse> {
    return apiFetch<CardAddCommentResponse>(`/cards/${cardId}/comments`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function cardDetailApi(cardId: string): Promise<{ data: BoardCardsResponse }> {
    return apiFetch<{ data: BoardCardsResponse }>(`/cards/${cardId}`)
}
