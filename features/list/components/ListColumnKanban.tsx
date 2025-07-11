'use client'

import { useEffect, useMemo, useState } from 'react'
import { ListColumn, useListGetListQuery, useListReorderMutation } from '@/features/list'
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { ListGetListItem, ListGetListResponse } from '@/types'
import { createPortal } from 'react-dom'

interface Props {
    boardId: string
}

export function ListColumnKanban({ boardId }: Props) {
    const { data: lists } = useListGetListQuery(boardId)
    const [columns, setColumns] = useState<ListGetListResponse['data']>([])
    const columnsIds = useMemo(() => columns.map((col) => col.id), [columns])
    const [activeColumn, setActiveColumn] = useState<ListGetListItem | null>(null)
    const { mutateAsync } = useListReorderMutation()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        })
    )

    useEffect(() => {
        if (lists?.data) {
            setColumns(lists.data)
        }
    }, [lists?.data])

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)

            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null)

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
            boardId,
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
        if (!isActiveATask) return
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <SortableContext items={columnsIds} strategy={horizontalListSortingStrategy}>
                <ul className="flex gap-4 items-start overflow-hidden h-full">
                    {columns.map((column) => (
                        <ListColumn
                            key={column.id}
                            column={column}
                        />
                    ))}
                </ul>
            </SortableContext>

            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ListColumn
                            column={activeColumn}
                            isOverlay
                        />
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext >
    )
}
