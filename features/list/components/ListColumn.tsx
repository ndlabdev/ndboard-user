import { CSS } from '@dnd-kit/utilities'
import { CardItemKanban } from '@/features/card'
import { useSortable } from '@dnd-kit/sortable'
import { BoardCardsResponse, BoardListsResponse } from '@/types'
import { CSSProperties, Dispatch, SetStateAction } from 'react'

interface Props {
    column: BoardListsResponse
    cards: BoardCardsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
    isOverlay?: boolean
}

export function ListColumn({ column, cards, setCards, isOverlay = false }: Props) {
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

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(isOverlay && {
            opacity: 0.85,
            pointerEvents: 'none',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            background: 'rgba(255, 255, 255, 0.95)'
        })
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="list-none flex-none flex flex-col w-72 bg-white rounded-xl max-h-full pb-2 transition-all duration-200 ease-in-out"
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

            <CardItemKanban
                listId={column.id}
                cards={cards}
                setCards={setCards}
            />
        </li >
    )
}
