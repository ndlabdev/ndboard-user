import { ListArchive, ListArchiveAllCards, ListCopy, ListMove, ListMoveAllCards } from '@/features/list'
import { BoardCardsResponse, BoardListsResponse } from '@/types'
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
    column: BoardListsResponse
    setColumns: Dispatch<SetStateAction<BoardListsResponse[]>>
    cards: BoardCardsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
    workspaceId: string
    columns: BoardListsResponse[]
    setAddingIndex: Dispatch<SetStateAction<number | 'end' | null>>
    setNewCardTitle: Dispatch<SetStateAction<string>>
    isMenuOpen: boolean
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const ListActions = memo(function ListActions({
    column,
    setColumns,
    cards,
    setCards,
    workspaceId,
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
                        workspaceId={workspaceId}
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
                        column={column}
                        setColumns={setColumns}
                        setCards={setCards}
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
