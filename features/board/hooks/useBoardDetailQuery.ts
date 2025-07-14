import { useQueries, useQuery, UseQueryResult } from '@tanstack/react-query'
import { boardDetailApi, cardGetListApi } from '@/lib/api'
import type { BoardDetailResponse } from '@/types'

export function useBoardDetailQuery(shortLink: string): UseQueryResult<BoardDetailResponse, unknown> {
    return useQuery({
        queryKey: ['boards', shortLink],
        queryFn: () => boardDetailApi(shortLink)
    })
}

export function useBoardWithCardsQuery(shortLink: string) {
    const boardDetail = useBoardDetailQuery(shortLink)
    const lists = boardDetail.data?.data.lists ?? []

    const enabled = !!(lists && lists.length > 0)
    const cardsQueries = useQueries({
        queries: enabled
            ? lists.map((list) => ({
                queryKey: ['cards', list.id],
                queryFn: () => cardGetListApi(list.id),
                enabled: !!list.id
            }))
            : []
    })

    const allCards = cardsQueries
        .filter((q) => q.isSuccess && q.data)
        .flatMap((q) => q.data?.data ?? [])

    const isCardsLoading = enabled
        ? cardsQueries.some((q) => q.isLoading || q.isFetching)
        : false
    const isCardsError = cardsQueries.some((q) => q.isError)

    return {
        ...boardDetail,
        allCards,
        isCardsLoading,
        isCardsError,
        cardsQueries
    }
}
