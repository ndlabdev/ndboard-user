import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { cardGetListApi } from '@/lib/api'
import type { CardGetListResponse } from '@/types'

export function useCardGetListQuery(listId: string): UseQueryResult<CardGetListResponse, unknown> {
    return useQuery({
        queryKey: ['cards', listId],
        queryFn: () => cardGetListApi(listId),
        enabled: !!listId,
        placeholderData: keepPreviousData
    })
}
