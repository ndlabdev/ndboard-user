import { apiFetch } from '@/lib/fetcher'
import type { CardCreateResponse, CardGetListResponse } from '@/types'
import { CardCreateFormValues, CardReorderFormValues } from '@/features/card'

export function cardGetListApi(listId: string): Promise<CardGetListResponse> {
    return apiFetch<CardGetListResponse>(`/cards/l/${listId}`)
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
