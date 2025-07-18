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

    const listCards = lists.map((list, idx) => {
        const q = cardsQueries[idx]

        return {
            list,
            cards: q?.data?.data ?? [],
            isLoading: q?.isLoading || q?.isFetching,
            isError: q?.isError
        }
    })

    const allCards = listCards.flatMap((item) => item.cards)
    const isDragReady = listCards.every((item) => !item.isLoading)

    return {
        ...boardDetail,
        listCards,
        allCards,
        isDragReady
    }
}
