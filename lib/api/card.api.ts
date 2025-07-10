import { apiFetch } from '@/lib/fetcher'
import type { CardGetListResponse } from '@/types'

export function cardGetListApi(listId: string): Promise<CardGetListResponse> {
    return apiFetch<CardGetListResponse>(`/cards/l/${listId}`)
}
