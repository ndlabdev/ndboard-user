import { apiFetch } from '@/lib/fetcher'
import type { ListGetListResponse } from '@/types'
import { ListReorderFormValues } from '@/features/list'

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
