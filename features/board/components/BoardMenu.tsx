import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { BoardMenuArchive, BoardMenuBackgroundPicker, BoardMenuStar, BoardMenuVisibility } from '@/features/board'
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
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="link"
                            className={'size-6 cursor-pointer'}
                            tabIndex={0}
                            aria-label="Menu"
                        >
                            <Settings className={`size-4 ${textColor === 'white' ? 'text-white' : 'text-black'}`} />
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent side="bottom">Menu</TooltipContent>
                </Tooltip>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={4}
                className="w-80"
            >
                <DropdownMenuGroup>
                    <BoardMenuVisibility board={board} />

                    <BoardMenuStar board={board} />
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <BoardMenuBackgroundPicker board={board} />

                    <BoardMenuArchive
                        board={board}
                        textColor={textColor}
                    />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})
