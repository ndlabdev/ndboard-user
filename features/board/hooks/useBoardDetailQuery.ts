import { useMemo } from 'react'
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

    const listCards = useMemo(() => ({
        columns: lists.map((list, idx) => ({
            ...list,
            cards: cardsQueries[idx]?.data?.data ?? [],
            isLoading: cardsQueries[idx]?.isLoading || cardsQueries[idx]?.isFetching,
            isError: cardsQueries[idx]?.isError
        }))
    }), [lists, cardsQueries])

    const isDragReady = !isCardsLoading && !boardDetailQuery.isLoading

    console.log(listCards)

    return {
        ...boardDetailQuery,
        board,
        listCards,
        isDragReady,
        isCardsLoading,
        isCardsError
    }
}
