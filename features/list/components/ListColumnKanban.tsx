'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ListColumn, ListColumnCreate, useListReorderMutation } from '@/features/list'
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { BoardCardsResponse, BoardDetailResponse, BoardListsResponse } from '@/types'
import { createPortal } from 'react-dom'
import { CardItem, useCardBulkReorderMutation } from '@/features/card'

interface Props {
    board: BoardDetailResponse['data']
    allCards: BoardCardsResponse[]
    listCards: {
        list: BoardListsResponse;
        cards: BoardCardsResponse | never[];
        isLoading: boolean;
        isError: boolean;
    }[]
    isDragReady: boolean
}

function isCardsOrderChanged(
    prev: BoardCardsResponse[],
    curr: BoardCardsResponse[]
): boolean {
    if (prev.length !== curr.length) return true

    const groupByList = (arr: BoardCardsResponse[]) =>
        arr.reduce<Record<string, string[]>>((acc, card) => {
            if (!acc[card.listId]) acc[card.listId] = []
            acc[card.listId].push(card.id)
            
            return acc
        }, {})

    const prevGroup = groupByList(prev)
    const currGroup = groupByList(curr)

    const allListIds = new Set([...Object.keys(prevGroup), ...Object.keys(currGroup)])

    for (const listId of allListIds) {
        const prevIds = prevGroup[listId] || []
        const currIds = currGroup[listId] || []
        if (prevIds.length !== currIds.length) return true
        for (let i = 0; i < prevIds.length; ++i) {
            if (prevIds[i] !== currIds[i]) return true
        }
    }
    
    return false
}

export function ListColumnKanban({ board, allCards, listCards, isDragReady }: Props) {
    const columnsOrderRef = useRef<string[]>(board.lists.map((l) => l.id))
    const cardsBeforeDragRef = useRef<BoardCardsResponse[]>([])
    
    const [columns, setColumns] = useState<BoardListsResponse[]>(board.lists)
    const [cards, setCards] = useState<BoardCardsResponse[]>(allCards)
    const [activeColumn, setActiveColumn] = useState<BoardListsResponse | null>(null)
    const [activeCard, setActiveCard] = useState<BoardCardsResponse | null>(null)

    const columnsIds = useMemo(() => columns.map((col) => col.id), [columns])

    const { mutateAsync: mutateListOrder } = useListReorderMutation()
    const { mutateAsync: mutateCardOrder } = useCardBulkReorderMutation()

    useEffect(() => {
        setCards(allCards)
    }, [allCards])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        })
    )

    const onDragStart = useCallback((event: DragStartEvent) => {
        const type = event.active.data.current?.type
        if (type === 'Column') setActiveColumn(event.active.data.current?.column)
        if (type === 'Card') setActiveCard(event.active.data.current?.card)
            
        cardsBeforeDragRef.current = [...cards]
    }, [cards])

    const onDragEnd = useCallback(async (event: DragEndEvent) => {
        setActiveColumn(null)
        setActiveCard(null)

        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (active.data.current?.type === 'Column' && over.data.current?.type === 'Column') {
            if (activeId === overId) return

            setColumns((prevColumns) => {
                const activeColumnIndex = prevColumns.findIndex((col) => col.id === activeId)
                const overColumnIndex = prevColumns.findIndex((col) => col.id === overId)
                const newColumns = arrayMove(prevColumns, activeColumnIndex, overColumnIndex)
                const newOrder = newColumns.map((col) => col.id)

                if (JSON.stringify(newOrder) !== JSON.stringify(columnsOrderRef.current)) {
                    columnsOrderRef.current = newOrder
                    mutateListOrder({
                        boardId: board.id,
                        lists: newColumns.map((col, idx) => ({
                            id: col.id,
                            order: idx
                        }))
                    })
                }
                
                return newColumns
            })
            
            return
        }

        if (active.data.current?.type === 'Card') {
            const prevCards = cardsBeforeDragRef.current

            if (isCardsOrderChanged(prevCards, cards)) {
                const listsToUpdate: { listId: string, cards: { id: string, order: number }[] }[] = []
                const group: Record<string, BoardCardsResponse[]> = {}

                for (const card of cards) {
                    if (!group[card.listId]) group[card.listId] = []
                    group[card.listId].push(card)
                }

                for (const listId in group) {
                    const arr = group[listId]
                    const prevArr = prevCards.filter((c) => c.listId === listId)
                    const changed =
                        arr.length !== prevArr.length ||
                        arr.some((c, idx) => c.id !== prevArr[idx]?.id)

                    if (changed) {
                        listsToUpdate.push({
                            listId,
                            cards: arr.map((card, order) => ({ id: card.id, order }))
                        })
                    }
                }
                if (listsToUpdate.length > 0) {
                    await mutateCardOrder({
                        lists: listsToUpdate
                    })
                }
            }
        }
    }, [
        board.id,
        mutateListOrder,
        mutateCardOrder,
        cardsBeforeDragRef,
        cards
    ])

    const onDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return

        const isActiveATask = active.data.current?.type === 'Card'
        const isOverCard = over.data.current?.type === 'Card'
        const isOverColumn = over.data.current?.type === 'Column'

        if (!isActiveATask) return
        setCards((prevCards) => {
            const activeCard = prevCards.find((card) => card.id === activeId)
            if (!activeCard) return prevCards

            if (isOverCard) {
                const overCard = prevCards.find((card) => card.id === overId)
                if (!overCard) return prevCards

                if (activeCard.listId !== overCard.listId) {
                    let next = prevCards.filter((card) => card.id !== activeCard.id)
                    const newCard = { ...activeCard, listId: overCard.listId }
                    const overIdx = next.findIndex((card) => card.id === overCard.id)
                    next = [
                        ...next.slice(0, overIdx),
                        newCard,
                        ...next.slice(overIdx)
                    ]
                    
                    return next
                } else {
                    const cardsInList = prevCards.filter((card) => card.listId === activeCard.listId)
                    const from = cardsInList.findIndex((card) => card.id === activeCard.id)
                    const to = cardsInList.findIndex((card) => card.id === overCard.id)
                    if (from === -1 || to === -1 || from === to) return prevCards
                    const moved = arrayMove(cardsInList, from, to)
                    const rest = prevCards.filter((card) => card.listId !== activeCard.listId)
                    
                    return [
                        ...rest,
                        ...moved
                    ]
                }
            }

            if (isOverColumn) {
                if (activeCard.listId !== overId) {
                    let next = prevCards.filter((card) => card.id !== activeCard.id)
                    const newCard = { ...activeCard, listId: overId.toString() }
                    const firstIdx = next.findIndex((card) => card.listId === overId)
                    if (firstIdx === -1) {
                        next = [...next, newCard]
                    } else {
                        next = [
                            ...next.slice(0, firstIdx),
                            newCard,
                            ...next.slice(firstIdx)
                        ]
                    }
                    
                    return next
                }
            }

            return prevCards
        })
    }, [])

    const cardsByListId = useMemo(() => {
        const map: Record<string, BoardCardsResponse[]> = {}
        for (const card of cards) {
            if (!map[card.listId]) map[card.listId] = []
            map[card.listId].push(card)
        }

        return map
    }, [cards])

    if (!isDragReady) {
        return (
            <ul className="flex gap-4 items-start px-4 py-6 overflow-y-hidden h-full">
                {listCards.map(({ list, cards, isLoading }) => (
                    <ListColumn
                        key={list.id}
                        workspaceId={board.workspaceId}
                        column={list}
                        columns={columns}
                        setColumns={setColumns}
                        cards={cards as BoardCardsResponse[]}
                        isCardsLoading={isLoading}
                    />
                ))}
                <ListColumnCreate boardId={board.id} setColumns={setColumns} />
            </ul>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <SortableContext items={columnsIds} strategy={horizontalListSortingStrategy}>
                <ul className="flex gap-4 items-start px-4 py-6 overflow-y-hidden h-full">
                    {columns.map((column) => (
                        <ListColumn
                            key={column.id}
                            workspaceId={board.workspaceId}
                            column={column}
                            columns={columns}
                            setColumns={setColumns}
                            cards={cardsByListId[column.id] ?? []}
                            setCards={setCards}
                        />
                    ))}
                    <ListColumnCreate
                        boardId={board.id}
                        setColumns={setColumns}
                    />
                </ul>
            </SortableContext>

            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ListColumn
                            workspaceId={board.workspaceId}
                            column={activeColumn}
                            columns={columns}
                            setColumns={setColumns}
                            cards={cards.filter((task) => task.listId === activeColumn.id)}
                            isOverlay
                        />
                    )}
                    {activeCard && (
                        <CardItem
                            card={activeCard}
                            isOverlay
                        />
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    )
}
