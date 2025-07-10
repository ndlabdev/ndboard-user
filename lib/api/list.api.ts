import { apiFetch } from '@/lib/fetcher'
import type { ListGetListResponse } from '@/types'

export function listGetListApi(boardId: string): Promise<ListGetListResponse> {
    return apiFetch<ListGetListResponse>('/lists', {
        query: {
            boardId
        }
    })
}
