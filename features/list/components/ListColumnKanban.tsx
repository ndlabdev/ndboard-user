'use client'

import { useMemo, useState } from 'react'
import { ListColumn, ListColumnCreate, useListReorderMutation } from '@/features/list'
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { BoardCardsResponse, BoardDetailResponse, BoardListsResponse } from '@/types'
import { createPortal } from 'react-dom'
import { CardItem } from '@/features/card'

interface Props {
    board: BoardDetailResponse['data']
}

export function ListColumnKanban({ board }: Props) {
    const [columns, setColumns] = useState<BoardListsResponse[]>(board.lists)
    const columnsIds = useMemo(() => columns.map((col) => col.id), [columns])
    const [cards, setCards] = useState<BoardCardsResponse[]>(board.cards)
    const [activeColumn, setActiveColumn] = useState<BoardListsResponse | null>(null)
    const [activeCard, setActiveCard] = useState<BoardCardsResponse | null>(null)
    const { mutateAsync } = useListReorderMutation()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        })
    )

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)

            return
        }

        if (event.active.data.current?.type === 'Card') {
            setActiveCard(event.active.data.current.card)

            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null)
        setActiveCard(null)

        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return

        const isActiveAColumn = active.data.current?.type === 'Column'
        if (!isActiveAColumn) return

        const activeColumnIndex = columns.findIndex((col) => col.id === activeId)
        const overColumnIndex = columns.findIndex((col) => col.id === overId)
    
        if (activeColumnIndex === overColumnIndex) return
    
        const newOrder = arrayMove(columns, activeColumnIndex, overColumnIndex)
        setColumns(newOrder)
    
        mutateAsync({
            boardId: board.id,
            lists: newOrder.map((col, idx) => ({
                id: col.id,
                order: idx
            }))
        })
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return

        const isActiveATask = active.data.current?.type === 'Card'
        const isOverATask = over.data.current?.type === 'Card'
        if (!isActiveATask) return

        if (isActiveATask && isOverATask) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((t) => t.id === activeId)
                const overIndex = cards.findIndex((t) => t.id === overId)
                if (cards[activeIndex].listId != cards[overIndex].listId) {
                    cards[activeIndex].listId = cards[overIndex].listId
                    
                    return arrayMove(cards, activeIndex, overIndex - 1)
                }
                
                return arrayMove(cards, activeIndex, overIndex)
            })
        }

        const isOverAColumn = over.data.current?.type === 'Column'
        if (isActiveATask && isOverAColumn) {
            setCards((cards) => {
                const activeIndex = cards.findIndex((t) => t.id === activeId)
                cards[activeIndex].listId = overId.toString()
                console.log('DROPPING TASK OVER COLUMN', { activeIndex })
                
                return arrayMove(cards, activeIndex, activeIndex)
            })
        }
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
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
                            column={activeColumn}
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
