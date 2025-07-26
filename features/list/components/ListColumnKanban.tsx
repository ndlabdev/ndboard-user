'use client'

import { useEffect, useRef, useState } from 'react'
import { ListColumn, ListColumnCreate, useListReorderMutation } from '@/features/list'
import { BoardCardsResponse, BoardDetailResponse, BoardListsResponse } from '@/types'
import { useCardBulkReorderMutation } from '@/features/card'
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element'
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder'
import invariant from 'tiny-invariant'
import { bindAll } from 'bind-event-listener'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element'
import { blockBoardPanningAttr, isCardData, isCardDropTargetData, isColumnData, isDraggingACard, isDraggingAColumn, settings, TColumn } from '@/shared/data'

interface Props {
    board: BoardDetailResponse['data']
    listCards: {
        columns: Array<BoardListsResponse & {
            cards: BoardCardsResponse[]
            isLoading: boolean
            isError: boolean
        }>
    }
}

export function ListColumnKanban({ board, listCards }: Props) {
    const [data, setData] = useState(listCards)
    const scrollableRef = useRef<HTMLDivElement | null>(null)
    const { mutateAsync: mutateListOrder } = useListReorderMutation()
    const { mutateAsync: mutateCardOrder } = useCardBulkReorderMutation()

    useEffect(() => {
        setData(listCards)
    }, [listCards])

    useEffect(() => {
        const element = scrollableRef.current
        invariant(element)

        return combine(
            monitorForElements({
                canMonitor: isDraggingACard,
                onDrop({ source, location }) {
                    const dragging = source.data
                    if (!isCardData(dragging)) return

                    const innerMost = location.current.dropTargets[0]
                    if (!innerMost) return

                    const dropTargetData = innerMost.data
                    const homeColumnIndex = data.columns.findIndex((column) => column.id === dragging.columnId)
                    const home = data.columns[homeColumnIndex]
                    if (!home) return

                    const cardIndexInHome = home.cards.findIndex((card) => card.id === dragging.card.id)

                    if (isCardDropTargetData(dropTargetData)) {
                        const destinationColumnIndex = data.columns.findIndex((column) => column.id === dropTargetData.columnId)
                        const destination = data.columns[destinationColumnIndex]

                        if (home === destination) {
                            const cardFinishIndex = home.cards.findIndex((card) => card.id === dropTargetData.card.id)

                            if ((cardIndexInHome === -1 || cardFinishIndex === -1) || cardIndexInHome === cardFinishIndex) return

                            const columns = Array.from(data.columns)
                            columns[homeColumnIndex] = {
                                ...home,
                                cards: reorderWithEdge({
                                    axis: 'vertical',
                                    list: home.cards,
                                    startIndex: cardIndexInHome,
                                    indexOfTarget: cardFinishIndex,
                                    closestEdgeOfTarget: extractClosestEdge(dropTargetData)
                                })
                            }

                            setData({ ...data, columns })

                            mutateCardOrder({
                                lists: [{
                                    listId: home.id,
                                    cards: columns[homeColumnIndex].cards.map((card, idx) => ({
                                        id: card.id,
                                        order: idx
                                    }))
                                }]
                            })

                            return
                        }

                        if (!destination) return

                        const indexOfTarget = destination.cards.findIndex((card) => card.id === dropTargetData.card.id)

                        const closestEdge = extractClosestEdge(dropTargetData)
                        const finalIndex = closestEdge === 'bottom' ? indexOfTarget + 1 : indexOfTarget
                        const homeCards = Array.from(home.cards)

                        homeCards.splice(cardIndexInHome, 1)

                        const destinationCards = Array.from(destination.cards)
                        destinationCards.splice(finalIndex, 0, dragging.card)

                        const columns = Array.from(data.columns)
                        columns[homeColumnIndex] = {
                            ...home,
                            cards: homeCards
                        }
                        columns[destinationColumnIndex] = {
                            ...destination,
                            cards: destinationCards
                        }
                        setData({ ...data, columns })

                        mutateCardOrder({
                            lists: [
                                {
                                    listId: home.id,
                                    cards: columns[homeColumnIndex].cards.map((card, idx) => ({
                                        id: card.id,
                                        order: idx
                                    }))
                                },
                                {
                                    listId: destination.id,
                                    cards: columns[destinationColumnIndex].cards.map((card, idx) => ({
                                        id: card.id,
                                        order: idx
                                    }))
                                }
                            ]
                        })

                        return
                    }

                    if (isColumnData(dropTargetData)) {
                        const destinationColumnIndex = data.columns.findIndex((column) => column.id === dropTargetData.column.id)
                        const destination = data.columns[destinationColumnIndex]

                        if (!destination) return

                        if (home === destination) {
                            const reordered = reorder({
                                list: home.cards,
                                startIndex: cardIndexInHome,
                                finishIndex: home.cards.length - 1
                            })

                            const updated: TColumn = {
                                ...home,
                                cards: reordered
                            }
                            const columns = Array.from(data.columns)
                            columns[homeColumnIndex] = updated
                            setData({ ...data, columns })

                            return
                        }

                        const homeCards = Array.from(home.cards)
                        homeCards.splice(cardIndexInHome, 1)

                        const destinationCards = Array.from(destination.cards)
                        destinationCards.splice(destination.cards.length, 0, dragging.card)

                        const columns = Array.from(data.columns)
                        columns[homeColumnIndex] = {
                            ...home,
                            cards: homeCards
                        }
                        columns[destinationColumnIndex] = {
                            ...destination,
                            cards: destinationCards
                        }
                        setData({ ...data, columns })

                        mutateCardOrder({
                            lists: [
                                {
                                    listId: home.id,
                                    cards: columns[homeColumnIndex].cards.map((card, idx) => ({
                                        id: card.id,
                                        order: idx
                                    }))
                                },
                                {
                                    listId: destination.id,
                                    cards: columns[destinationColumnIndex].cards.map((card, idx) => ({
                                        id: card.id,
                                        order: idx
                                    }))
                                }
                            ]
                        })

                        return
                    }
                }
            }),
            monitorForElements({
                canMonitor: isDraggingAColumn,
                onDrop({ source, location }) {
                    const dragging = source.data
                    if (!isColumnData(dragging)) {
                        return
                    }

                    const innerMost = location.current.dropTargets[0]

                    if (!innerMost) {
                        return
                    }
                    const dropTargetData = innerMost.data

                    if (!isColumnData(dropTargetData)) {
                        return
                    }

                    const homeIndex = data.columns.findIndex((column) => column.id === dragging.column.id)
                    const destinationIndex = data.columns.findIndex(
                        (column) => column.id === dropTargetData.column.id
                    )

                    if (homeIndex === -1 || destinationIndex === -1) {
                        return
                    }

                    if (homeIndex === destinationIndex) {
                        return
                    }

                    const reordered = reorder({
                        list: data.columns,
                        startIndex: homeIndex,
                        finishIndex: destinationIndex
                    })

                    mutateListOrder({
                        lists: reordered.map((item, idx) => ({ id: item.id, order: idx })),
                        boardId: board.id
                    })

                    setData({ ...data, columns: reordered })
                }
            }),
            
            autoScrollForElements({
                element,
                getConfiguration: () => ({ maxScrollSpeed: settings.boardScrollSpeed }),
                canScroll: ({ source }) =>
                    settings.isOverElementAutoScrollEnabled &&
                    (isDraggingACard({ source }) || isDraggingAColumn({ source }))
            }),

            unsafeOverflowAutoScrollForElements({
                element,
                getConfiguration: () => ({ maxScrollSpeed: settings.boardScrollSpeed }),
                canScroll: ({ source }) =>
                    settings.isOverElementAutoScrollEnabled &&
                    settings.isOverflowScrollingEnabled &&
                    (isDraggingACard({ source }) || isDraggingAColumn({ source })),
                getOverflow: () => ({
                    forLeftEdge: { left: 1000, top: 1000, bottom: 1000 },
                    forRightEdge: { right: 1000, top: 1000, bottom: 1000 }
                })
            })
        )
    }, [data, board.id, mutateCardOrder, mutateListOrder])

    useEffect(() => {
        let cleanupActive: CleanupFn | null = null
        const scrollable = scrollableRef.current
        invariant(scrollable)

        const begin = ({ startX }: { startX: number }) => {
            let lastX = startX
            const cleanup = bindAll(
                window,
                [
                    {
                        type: 'pointermove',
                        listener(e) {
                            const diffX = lastX - e.clientX
                            lastX = e.clientX
                            scrollable.scrollBy({ left: diffX })
                        }
                    },
                    ...(['pointerup', 'pointercancel', 'click', 'resize', 'keydown'] as const).map(
                        (evt) => ({ type: evt, listener: () => cleanup() })
                    )
                ],
                { capture: true }
            )
            cleanupActive = cleanup
        }

        const cleanupStart = bindAll(scrollable, [
            {
                type: 'pointerdown',
                listener(e) {
                    if (
                        e.target instanceof HTMLElement &&
                        !e.target.closest(`[${blockBoardPanningAttr}]`)
                    ) {
                        begin({ startX: e.clientX })
                    }
                }
            }
        ])

        return () => {
            cleanupStart()
            cleanupActive?.()
        }
    }, [])

    return (
        <div
            ref={scrollableRef}
            className="flex h-full flex-row gap-3 overflow-x-auto overflow-y-hidden"
        >
            <div className="flex gap-4 items-start px-4 py-6 h-full">
                {data.columns.map((column) => (
                    <ListColumn
                        key={column.id}
                        board={board}
                        column={column}
                    />
                ))}

                <ListColumnCreate board={board} />
            </div>
        </div>
    )
}
