import { CardItemKanban } from '@/features/card'
import { ListFold } from '@/features/list'
import { BoardCardsResponse, BoardDetailResponse, BoardListsResponse } from '@/types'
import { Dispatch, memo, SetStateAction, useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'

interface Props {
    board: BoardDetailResponse['data']
    column: BoardListsResponse
    setColumns: Dispatch<SetStateAction<Record<string, BoardCardsResponse[]>>>
    cards: BoardCardsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
    workspaceId: string
    columns: Record<string, BoardCardsResponse[]>
    isCardsLoading?: boolean
    index?: number
}

export const ListColumn = memo(function ListColumn({
    board,
    column,
    setColumns,
    cards,
    setCards,
    workspaceId,
    columns,
    isCardsLoading = false,
    index = 0
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [addingIndex, setAddingIndex] = useState<number | 'end' | null>(null)
    const [newCardTitle, setNewCardTitle] = useState('')

    return (
        <Draggable
            key={column.id}
            draggableId={column.id}
            index={index}
        >
            {(provided) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`list-none flex-none flex flex-col bg-white rounded-xl max-h-full ${column.isFold ? 'w-14 min-w-14 max-w-14 items-center px-0 py-3' : 'w-72 min-w-72 max-w-72 pb-2'}`}
                >
                    <header className="cursor-grab active:cursor-grabbing select-none">
                        <ListFold
                            board={board}
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
            )}
        </Draggable>
    )
})
