import { ListArchive, ListArchiveAllCards, ListCopy, ListMove, ListMoveAllCards } from '@/features/list'
import { BoardCardsResponse, BoardDetailResponse, BoardListsResponse } from '@/types'
import { Dispatch, memo, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

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

export const ListActions = memo(function ListActions({
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
    return (
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="cursor-pointer"
                >
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={4}
            >
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => {
                            setAddingIndex('end')
                            setNewCardTitle('')
                            setIsMenuOpen(false)
                        }}
                    >
                        Add card
                    </DropdownMenuItem>

                    <ListCopy
                        column={column}
                        setColumns={setColumns}
                        cards={cards}
                        setCards={setCards}
                    />

                    <ListMove
                        column={column}
                        setColumns={setColumns}
                        setCards={setCards}
                    />

                    <ListMoveAllCards
                        column={column}
                        columns={columns}
                        setCards={setCards}
                        setIsMenuOpen={setIsMenuOpen}
                    />
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <ListArchive
                        board={board}
                        column={column}
                    />

                    <ListArchiveAllCards
                        column={column}
                        setCards={setCards}
                    />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})
