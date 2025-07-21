import { ListActions, useListUpdateMutation } from '@/features/list'
import { BoardCardsResponse, BoardDetailResponse, BoardListsResponse } from '@/types'
import { Dispatch, memo, SetStateAction, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FoldHorizontal, UnfoldHorizontal } from 'lucide-react'

interface Props {
    board: BoardDetailResponse['data']
    column: BoardListsResponse
    columns: Record<string, {
        isLoading: boolean;
        cards: BoardCardsResponse[];
    }>
    setColumns: Dispatch<SetStateAction<Record<string, {
        isLoading: boolean;
        cards: BoardCardsResponse[];
    }>>>
    cards: BoardCardsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
    setAddingIndex: Dispatch<SetStateAction<number | 'end' | null>>
    setNewCardTitle: Dispatch<SetStateAction<string>>
    isMenuOpen: boolean
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const ListFold = memo(function ListFold({
    board,
    column,
    setColumns,
    cards,
    setCards,
    columns,
    setAddingIndex,
    setNewCardTitle,
    isMenuOpen,
    setIsMenuOpen
}: Props) {
    const { mutate } = useListUpdateMutation(column.id, board.shortLink)

    const handleFoldCard = useCallback((isFold = false) => {
        mutate({
            id: column.id,
            isFold
        })
    }, [mutate, column.id])

    return (
        <>
            {!column.isFold ? (
                <div className="flex items-center justify-between px-3 pt-2">
                    <h3 className="font-semibold">{column.name}</h3>

                    <div>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => handleFoldCard(true)}
                        >
                            <FoldHorizontal />
                        </Button>

                        <ListActions
                            board={board}
                            column={column}
                            setColumns={setColumns}
                            cards={cards}
                            setCards={setCards}
                            columns={columns}
                            setAddingIndex={setAddingIndex}
                            setNewCardTitle={setNewCardTitle}
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 justify-center h-full">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer size-4 hover:bg-transparent"
                        onClick={() => handleFoldCard()}
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
        </>
    )
})
