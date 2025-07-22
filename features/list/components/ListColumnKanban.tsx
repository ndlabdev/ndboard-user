'use client'

import { useEffect, useMemo, useState } from 'react'
import { ListColumn, ListColumnCreate, useListReorderMutation } from '@/features/list'
import { BoardCardsResponse, BoardDetailResponse, BoardListsResponse } from '@/types'
import { useCardBulkReorderMutation } from '@/features/card'
import { DragDropContext, Droppable, DropResult, DraggableLocation } from '@hello-pangea/dnd'

interface Props {
    board: BoardDetailResponse['data']
    isDragReady: boolean
    listCardsMap: Record<string, { isLoading: boolean, cards: BoardCardsResponse[] }>
}

function reorder<TItem>(list: TItem[], startIndex: number, endIndex: number): TItem[] {
    const result = [...list]
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

export const reorderQuoteMap = ({
    quoteMap,
    source,
    destination
}: {
    quoteMap: Record<string, { isLoading: boolean, cards: BoardCardsResponse[] }>,
    source: DraggableLocation,
    destination: DraggableLocation
}) => {
    const currentCards = [...(quoteMap[source.droppableId]?.cards ?? [])]
    const nextCards = [...(quoteMap[destination.droppableId]?.cards ?? [])]
    const target = currentCards[source.index]

    if (source.droppableId === destination.droppableId) {
        const reordered = reorder(currentCards, source.index, destination.index)

        return {
            quoteMap: {
                ...quoteMap,
                [source.droppableId]: {
                    ...quoteMap[source.droppableId],
                    cards: reordered
                }
            }
        }
    }
    currentCards.splice(source.index, 1)
    nextCards.splice(destination.index, 0, target)

    return {
        quoteMap: {
            ...quoteMap,
            [source.droppableId]: {
                ...quoteMap[source.droppableId],
                cards: currentCards
            },
            [destination.droppableId]: {
                ...quoteMap[destination.droppableId],
                cards: nextCards
            }
        }
    }
}

export function ListColumnKanban({ board, isDragReady, listCardsMap }: Props) {
    const [columns, setColumns] = useState(listCardsMap)
    const [ordered, setOrdered] = useState(() => Object.keys(listCardsMap))

    const { mutateAsync: mutateListOrder } = useListReorderMutation()
    const { mutateAsync: mutateCardOrder } = useCardBulkReorderMutation()

    useEffect(() => {
        const keys = Object.keys(listCardsMap)
        setColumns(listCardsMap)
        setOrdered((prev) => {
            if (prev.length !== keys.length) return keys

            return prev
        })
    }, [listCardsMap])

    const onDragEnd = (result: DropResult<string>) => {
        if (!result.destination) {
            return
        }

        const source: DraggableLocation = result.source
        const destination: DraggableLocation = result.destination

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        if (result.type === 'COLUMN') {
            const newOrdered = reorder(ordered, source.index, destination.index)

            if (ordered.join(',') !== newOrdered.join(',')) {
                setOrdered(newOrdered)
                mutateListOrder({
                    lists: newOrdered.map((id, order) => ({ id, order })),
                    boardId: board.id
                })
            }

            return
        }

        const data = reorderQuoteMap({
            quoteMap: columns,
            source,
            destination
        })

        const prevColumns = columns
        const nextColumns = data.quoteMap
        const changedListIds = [source.droppableId, destination.droppableId]
            .filter((v, i, arr) => arr.indexOf(v) === i)

        const listsPayload = changedListIds.map((listId) => ({
            listId,
            cards: (nextColumns[listId]?.cards ?? []).map((card, order) => ({
                id: card.id,
                order
            }))
        }))

        const hasChanged = changedListIds.some((listId) => {
            const oldIds = (prevColumns[listId]?.cards ?? []).map((c) => c.id).join(',')
            const newIds = (nextColumns[listId]?.cards ?? []).map((c) => c.id).join(',')

            return oldIds !== newIds
        })

        if (hasChanged) {
            mutateCardOrder({
                lists: listsPayload
            })
        }

        setColumns(nextColumns)
    }

    const listMap = useMemo(() => {
        const map: Record<string, BoardListsResponse> = {}
        for (const list of board.lists) {
            map[list.id] = list
        }

        return map
    }, [board.lists])

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
                droppableId="board"
                type="COLUMN"
                direction="horizontal"
                isDropDisabled={!isDragReady}
            >
                {(provided) => (
                    <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-4 items-start px-4 py-6 h-full"
                    >
                        {ordered.map((key, index) => (
                            <ListColumn
                                key={key}
                                index={index}
                                board={board}
                                column={listMap[key]}
                                cards={columns[key].cards || []}
                                isCardsLoading={columns[key].isLoading || false}
                            />
                        ))}
                        {provided.placeholder}
                        <ListColumnCreate board={board} />
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    )
}
