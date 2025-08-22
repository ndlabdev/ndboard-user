import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { BoardMenuArchiveList, BoardMenuBackgroundPicker, BoardMenuCustomFields, BoardMenuLabel, BoardMenuStar, BoardMenuVisibility } from '@/features/board'
import { BoardDetailResponse } from '@/types'

interface Props {
    board: BoardDetailResponse['data']
    textColor: string
}

export const BoardMenu = memo(function BoardMenu({
    board,
    textColor
}: Props) {
    return (
        <DropdownMenu>
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
                    <BoardMenuVisibility board={board} />

                    <BoardMenuStar board={board} />
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <BoardMenuBackgroundPicker board={board} />

                    <BoardMenuLabel board={board} />

                    <BoardMenuArchiveList
                        board={board}
                        textColor={textColor}
                    />

                    <BoardMenuCustomFields board={board} />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})
