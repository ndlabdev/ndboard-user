import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { cardDetailApi } from '@/lib/api'
import type { BoardCardsResponse } from '@/types'

export function useCardDetailQuery(
    cardId: string,
    enabled: boolean
): UseQueryResult<{ data: BoardCardsResponse }, unknown> {
    return useQuery({
        queryKey: ['cards', cardId],
        queryFn: () => cardDetailApi(cardId),
        enabled
    })
}
