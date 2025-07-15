import { isUrl } from '@/lib/utils'
import { CardLinkPreview } from '@/features/card'
import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { BoardCardsResponse } from '@/types'
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties } from 'react'

interface Props {
    card: BoardCardsResponse
    nearLastItem?: boolean
    isOverlay?: boolean
}

export function CardItem({ card, nearLastItem = false, isOverlay = false }: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition
    } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
            listId: card.listId
        },
        animateLayoutChanges: (args) =>
            defaultAnimateLayoutChanges({ ...args, wasDragging: true })
    })

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(isOverlay
            ? {
                opacity: 0.9,
                pointerEvents: 'none',
                boxShadow: '0 2px 12px #0004'
            }
            : {})
    }

    return (
        <li
            key={card.id}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white rounded-lg shadow border border-white hover:border-primary transition-all duration-200 group list-none cursor-pointer ${nearLastItem ? 'mb-2' : ''}`}
        >
            {isUrl(card.name) && card.meta
                ? <CardLinkPreview meta={card.meta} />
                : (
                    <div className="p-3">
                        <h4 className="font-semibold text-sm">
                            {card.name}
                        </h4>
                    </div>
                )}
        </li>
    )
}
