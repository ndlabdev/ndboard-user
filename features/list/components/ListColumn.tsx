import { CSS } from '@dnd-kit/utilities'
import { CardItemKanban } from '@/features/card'
import { ListFold } from '@/features/list'
import { useSortable } from '@dnd-kit/sortable'
import { BoardCardsResponse, BoardListsResponse } from '@/types'
import { CSSProperties, Dispatch, memo, SetStateAction, useState } from 'react'

interface Props {
    column: BoardListsResponse
    setColumns: Dispatch<SetStateAction<BoardListsResponse[]>>
    cards: BoardCardsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
    isOverlay?: boolean
    workspaceId: string
    columns: BoardListsResponse[]
    isCardsLoading?: boolean
}

export const ListColumn = memo(function ListColumn({
    column,
    setColumns,
    cards,
    setCards,
    isOverlay = false,
    workspaceId,
    columns,
    isCardsLoading = false
}: Props) {
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

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [addingIndex, setAddingIndex] = useState<number | 'end' | null>(null)
    const [newCardTitle, setNewCardTitle] = useState('')

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`list-none flex-none flex flex-col transition-all duration-200 ease-in-out bg-white rounded-xl max-h-full ${column.isFold ? 'w-14 min-w-10 max-w-10 items-center px-0 py-3' : 'w-72 pb-3'}`}
        >
            <header
                className="cursor-grab active:cursor-grabbing select-none"
                {...attributes}
                {...(isMenuOpen ? {} : listeners)}
            >
                <ListFold
                    column={column}
                    setColumns={setColumns}
                    cards={cards}
                    setCards={setCards}
                    workspaceId={workspaceId}
                    columns={columns}
                    setAddingIndex={setAddingIndex}
                    setNewCardTitle={setNewCardTitle}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                />
            </header>

            {!column.isFold && (
                <CardItemKanban
                    listId={column.id}
                    cards={cards}
                    setCards={setCards}
                    addingIndex={addingIndex}
                    setAddingIndex={setAddingIndex}
                    newCardTitle={newCardTitle}
                    setNewCardTitle={setNewCardTitle}
                    isCardsLoading={isCardsLoading}
                />
            )}
        </li>
    )
})
