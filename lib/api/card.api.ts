import { apiFetch } from '@/lib/fetcher'
import type { CardCreateResponse, CardGetListResponse } from '@/types'
import { CardCreateFormValues } from '@/features/card'

export function cardGetListApi(listId: string): Promise<CardGetListResponse> {
    return apiFetch<CardGetListResponse>(`/cards/l/${listId}`)
}

export function cardCreateApi(payload: CardCreateFormValues): Promise<CardCreateResponse> {
    return apiFetch<CardCreateResponse>('/cards', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}
