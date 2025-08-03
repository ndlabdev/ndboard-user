import { ListArchive, ListArchiveAllCards, ListCopy, ListMove, ListMoveAllCards } from '@/features/list'
import { BoardDetailResponse, BoardListsResponse } from '@/types'
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
    setAddingIndex: Dispatch<SetStateAction<number | 'end' | null>>
    setNewCardTitle: Dispatch<SetStateAction<string>>
    isMenuOpen: boolean
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const ListActions = memo(function ListActions({
    board,
    column,
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
                    aria-label="More actions"
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
                        board={board}
                        column={column}
                    />

                    <ListMove
                        board={board}
                        column={column}
                    />

                    <ListMoveAllCards
                        board={board}
                        column={column}
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
                        setIsMenuOpen={setIsMenuOpen}
                    />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})
