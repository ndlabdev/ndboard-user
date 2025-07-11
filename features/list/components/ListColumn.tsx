import { CSS } from '@dnd-kit/utilities'
import { CardItemKanban } from '@/features/card'
import { useSortable } from '@dnd-kit/sortable'
import { ListGetListItem } from '@/types'
import { CSSProperties } from 'react'

interface Props {
    column: ListGetListItem
    isOverlay?: boolean
}

export function ListColumn({ column, isOverlay = false }: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition
    } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    })

    const style: CSSProperties = isOverlay
        ? {
            width: '100%',
            opacity: 0.9,
            pointerEvents: 'none',
            boxShadow: '0 2px 12px #0004'
        }
        : {
            transition,
            transform: CSS.Transform.toString(transform)
        }

    return (
        <li
            ref={isOverlay ? undefined : setNodeRef}
            style={style}
            className="list-none flex-none flex flex-col w-72 bg-white/90 rounded-xl shadow-lg max-h-full"
        >
            <header
                className="cursor-grab active:cursor-grabbing select-none"
                {...attributes}
                {...listeners}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <h3>{column.name}</h3>
                </div>
            </header>

            <CardItemKanban listId={column.id} />
        </li >
    )
}
