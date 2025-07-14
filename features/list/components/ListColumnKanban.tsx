'use client'

import { useMemo, useState } from 'react'
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
}

export function ListColumnKanban({ board }: Props) {
    const [columns, setColumns] = useState<BoardListsResponse[]>(board.lists)
    const [cards, setCards] = useState<BoardCardsResponse[]>(board.cards)
    const [activeColumnId, setActiveColumnId] = useState<string | null>(null)
    const [activeCardId, setActiveCardId] = useState<string | null>(null)
    const [dragMeta, setDragMeta] = useState<{
        activeCardOriginListId?: string,
        overCardListId?: string,
        activeCardId?: string,
        overCardId?: string
    } | null>(null)
    const { mutateAsync: mutateListOrder } = useListReorderMutation()
    const { mutateAsync: mutateCardOrder } = useCardBulkReorderMutation()

    const columnsIds = useMemo(() => columns.map((col) => col.id), [columns])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        })
    )

    function onDragStart(event: DragStartEvent) {
        const type = event.active.data.current?.type
        if (type === 'Column') setActiveColumnId(event.active.id as string)
        if (type === 'Card') {
            setActiveCardId(event.active.id as string)
            setDragMeta({
                activeCardId: event.active.id as string,
                activeCardOriginListId: event.active.data.current?.listId
            })
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeType = active.data.current?.type
        const overType = over.data.current?.type
        if (activeType !== 'Card') return

        setDragMeta((meta) => ({
            ...(meta || {}),
            overCardId: over.id as string,
            overCardListId: overType === 'Card'
                ? over.data.current?.listId
                : (overType === 'Column' ? over.id.toString() : undefined)
        }))

        setCards((prev) => {
            const next = [...prev]
            const activeIndex = next.findIndex((card) => card.id === active.id)
            if (activeIndex === -1) return next

            const activeCard = next[activeIndex]

            if (overType === 'Card') {
                const overIndex = next.findIndex((card) => card.id === over.id)
                if (overIndex === -1) return next

                const overCard = next[overIndex]
                if (activeCard.listId !== overCard.listId) {
                    next.splice(activeIndex, 1)

                    const newCard = { ...activeCard, listId: overCard.listId }
                    const insertAt = next.findIndex((card) => card.id === over.id)

                    next.splice(insertAt, 0, newCard)
                } else {
                    return arrayMove(next, activeIndex, overIndex)
                }
            } else if (overType === 'Column') {
                const overListId = over.id.toString()
                if (activeCard.listId !== overListId) {
                    next.splice(activeIndex, 1)

                    const newCard = { ...activeCard, listId: overListId }
                    const destIndexes = next
                        .map((c, i) => c.listId === overListId ? i : -1)
                        .filter((i) => i !== -1)
                    const insertAt = destIndexes.length > 0
                        ? destIndexes[destIndexes.length - 1] + 1
                        : next.length

                    next.splice(insertAt, 0, newCard)
                }
            }

            return next
        })
    }

    async function onDragEnd(event: DragEndEvent) {
        setActiveColumnId(null)
        setActiveCardId(null)

        const { active, over } = event
        if (!over) {
            setDragMeta(null)

            return
        }

        const activeType = active.data.current?.type
        const overType = over.data.current?.type

        if (activeType === 'Column' && overType === 'Column') {
            if (active.id === over.id) {
                setDragMeta(null)

                return
            }
            const oldIdx = columns.findIndex((col) => col.id === active.id)
            const newIdx = columns.findIndex((col) => col.id === over.id)
            if (oldIdx === -1 || newIdx === -1) {
                setDragMeta(null)

                return
            }
            const newOrder = arrayMove(columns, oldIdx, newIdx)
            setColumns(newOrder)

            if (oldIdx !== newIdx) {
                await mutateListOrder({
                    boardId: board.id,
                    lists: newOrder.map((col, idx) => ({
                        id: col.id,
                        order: idx
                    }))
                })
            }

            setDragMeta(null)

            return
        }

        if (activeType === 'Card') {
            const originListId = dragMeta?.activeCardOriginListId ||
                (cards.find((c) => c.id === active.id)?.listId)

            let targetListId: string | undefined
            if (overType === 'Card') {
                targetListId = dragMeta?.overCardListId || (cards.find((c) => c.id === over.id)?.listId)
            } else if (overType === 'Column') {
                targetListId = over.id.toString()
            } else {
                targetListId = originListId
            }

            const changedListIds = Array.from(new Set([
                originListId,
                targetListId
            ].filter(Boolean))) as string[]

            const nextCards = cards.map((card) => ({ ...card }))
            changedListIds.forEach((listId) => {
                const cardsInList = nextCards
                    .filter((card) => card.listId === listId)
                    .map((card, idx) => ({
                        ...card,
                        order: idx
                    }))

                cardsInList.forEach((card) => {
                    const idx = nextCards.findIndex((c) => c.id === card.id)
                    if (idx !== -1) nextCards[idx].order = card.order
                })
            })

            const listsPayload = changedListIds.map((listId) => ({
                listId,
                cards: nextCards
                    .filter((card) => card.listId === listId)
                    .sort((a, b) => a.order - b.order)
                    .map((card) => ({
                        id: card.id,
                        order: card.order
                    }))
            })).filter((list) => list.cards.length > 0)

            if (listsPayload.length > 0) {
                await mutateCardOrder({ lists: listsPayload })
            }

            setCards(nextCards)
            setDragMeta(null)
        } else {
            setDragMeta(null)
        }
    }

    const activeColumn = activeColumnId
        ? columns.find((col) => col.id === activeColumnId) || null
        : null
    const activeCard = activeCardId
        ? cards.find((card) => card.id === activeCardId) || null
        : null

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
                            column={column}
                            cards={cards.filter((task) => task.listId === column.id)}
                            setCards={setCards}
                        />
                    ))}
                    <ListColumnCreate boardId={board.id} setColumns={setColumns} />
                </ul>
            </SortableContext>

            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ListColumn
                            column={activeColumn}
                            cards={cards.filter((task) => task.listId === activeColumn.id)}
                            isOverlay
                        />
                    )}
                    {activeCard && (
                        <CardItem card={activeCard} isOverlay />
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    )
}
