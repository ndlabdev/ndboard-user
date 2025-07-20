import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, Users } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { BoardMenuArchive, BoardMenuStar } from '@/features/board'
import { BoardDetailResponse } from '@/types'

interface Props {
    board: BoardDetailResponse['data']
    textColor: string
}

export const BoardMenu = memo(function BoardMenu({
    board,
    textColor
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="link"
                            className={'size-6 cursor-pointer'}
                            tabIndex={0}
                            aria-label="Menu"
                        >
                            <Settings className={`size-4 ${textColor === 'white' ? 'text-white' : 'text-black'}`} />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={4}
                        className="w-80"
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Users />
                                Visibility: <span className="capitalize">{board.visibility}</span>
                            </DropdownMenuItem>

                            <BoardMenuStar
                                board={board}
                                textColor={textColor}
                            />
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <BoardMenuArchive
                                board={board}
                                textColor={textColor}
                            />
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TooltipTrigger>

            <TooltipContent side="bottom">Menu</TooltipContent>
        </Tooltip>
    )
})
