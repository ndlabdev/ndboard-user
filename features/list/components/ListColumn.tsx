import { CSS } from '@dnd-kit/utilities'
import { CardItemKanban } from '@/features/card'
import { useSortable } from '@dnd-kit/sortable'
import { BoardCardsResponse, BoardListsResponse } from '@/types'
import { CSSProperties, Dispatch, memo, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FoldHorizontal, UnfoldHorizontal } from 'lucide-react'

interface Props {
    column: BoardListsResponse
    cards: BoardCardsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
    isOverlay?: boolean
}

export const ListColumn = memo(function ListColumn({ column, cards, setCards, isOverlay = false }: Props) {
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

    const [fold, setFold] = useState<boolean>(false)

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`list-none flex-none flex flex-col transition-all duration-200 ease-in-out bg-white rounded-xl max-h-full ${fold ? 'w-14 min-w-10 max-w-10 items-center px-0 py-3' : 'w-72 pb-3'}`}
        >
            <header
                className="cursor-grab active:cursor-grabbing select-none"
                {...attributes}
                {...listeners}
            >
                {!fold ? (
                    <div className="flex items-center justify-between px-4 py-3">
                        <h3 className="font-semibold">{column.name}</h3>

                        <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => setFold(true)}
                        >
                            <FoldHorizontal />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 justify-center h-full">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer size-4 hover:bg-transparent"
                            onClick={() => setFold(false)}
                        >
                            <UnfoldHorizontal />
                        </Button>

                        <h3
                            className="font-semibold whitespace-nowrap origin-bottom-left"
                            style={{ writingMode: 'vertical-rl' }}
                        >
                            {column.name}
                        </h3>
                    </div>
                )}
            </header>

            {!fold && (
                <CardItemKanban
                    listId={column.id}
                    cards={cards}
                    setCards={setCards}
                />
            )}
        </li>
    )
})
