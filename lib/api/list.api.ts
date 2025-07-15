import { apiFetch } from '@/lib/fetcher'
import type { ListGetListResponse, ListCreateResponse, ListUpdateResponse } from '@/types'
import { ListReorderFormValues, ListCreateFormValues, ListUpdateFormValues } from '@/features/list'

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
