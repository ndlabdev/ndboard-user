import { memo, useCallback, useState } from 'react'
import { Check } from 'lucide-react'
import {
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { BOARD_VISIBILITY_ICONS, BOARD_VISIBILITY_OPTIONS, useBoardUpdateMutation } from '@/features/board'
import { BoardDetailResponse } from '@/types'

interface Props {
    board: BoardDetailResponse['data']
}

export const Spinner = ({ size = 16 }) => (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
)

export const BoardMenuVisibility = memo(function BoardMenuVisibility({
    board
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const { mutate, isPending, variables } = useBoardUpdateMutation()

    const loadingOption = isPending ? variables?.visibility : null

    const handleChangeVisibility = useCallback(
        (visibility: string) => {
            if (board && visibility !== board.visibility && !isPending) {
                mutate({
                    shortLink: board.shortLink,
                    visibility
                })
            }
        },
        [mutate, board, isPending]
    )

    const CurrentIcon = BOARD_VISIBILITY_ICONS[board.visibility]

    return (
        <DropdownMenuSub open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
                <CurrentIcon className="size-5" />
                <span>
                    Visibility: <span className="capitalize">{board.visibility}</span>
                </span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {BOARD_VISIBILITY_OPTIONS.map((option) => {
                        const Icon = BOARD_VISIBILITY_ICONS[option.id]
                        const isSelected = board.visibility === option.id
                        const isLoadingThis = loadingOption === option.id

                        return (
                            <DropdownMenuItem
                                key={option.id}
                                className={`flex flex-col items-start gap-1 ${isLoadingThis ? 'opacity-50 pointer-events-none' : ''}`}
                                disabled={isLoadingThis}
                                onSelect={(e) => {
                                    e.preventDefault()
                                    handleChangeVisibility(option.id)
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="size-4" />
                                    <h5>{option.label}</h5>
                                    {isLoadingThis ? (
                                        <Spinner size={16} />
                                    ) : (
                                        isSelected && <Check className="size-4 ml-auto text-primary" />
                                    )}
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    {option.description}
                                </p>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
})
