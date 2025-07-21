import { useMemo } from 'react'
import { useQueries, useQuery, UseQueryResult } from '@tanstack/react-query'
import { boardDetailApi, cardGetListApi } from '@/lib/api'
import type { BoardCardsResponse, BoardDetailResponse } from '@/types'

export function useBoardDetailQuery(shortLink: string): UseQueryResult<BoardDetailResponse, unknown> {
    return useQuery({
        queryKey: ['boards', shortLink],
        queryFn: () => boardDetailApi(shortLink)
    })
}

export function useBoardWithCardsQuery(shortLink: string) {
    const boardDetailQuery = useBoardDetailQuery(shortLink)
    const board = boardDetailQuery.data?.data
    const lists = useMemo(() => board?.lists ?? [], [board?.lists])

    const cardsQueries = useQueries({
        queries: lists.map((list) => ({
            queryKey: ['cards', list.id],
            queryFn: () => cardGetListApi(list.id),
            enabled: !!list.id
        }))
    })

    const isCardsLoading = cardsQueries.some((q) => q.isLoading || q.isFetching)
    const isCardsError = cardsQueries.some((q) => q.isError)

    const listCards = useMemo(() =>
        lists.map((list, idx) => ({
            list,
            cards: cardsQueries[idx]?.data?.data ?? [],
            isLoading: cardsQueries[idx]?.isLoading || cardsQueries[idx]?.isFetching,
            isError: cardsQueries[idx]?.isError
        })), [lists, cardsQueries]
    )

    const listCardsMap = useMemo(() => {
        const map: Record<string, {
            isLoading: boolean,
            cards: BoardCardsResponse[]
        }> = {}
        for (const item of listCards) {
            map[item.list.id] = {
                isLoading: item.isLoading,
                cards: item.cards as BoardCardsResponse[]
            }
        }

        return map
    }, [listCards])

    const isDragReady = !isCardsLoading && !boardDetailQuery.isLoading

    return {
        ...boardDetailQuery,
        board,
        listCardsMap,
        isDragReady,
        isCardsLoading,
        isCardsError
    }
}
