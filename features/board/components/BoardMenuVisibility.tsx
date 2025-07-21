import { memo, useCallback, useState } from 'react'
import { Check, Users } from 'lucide-react'
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

    const handleChangeVisibility = useCallback(
        (visibility: string) => {
            if (board) {
                mutate({
                    shortLink: board.shortLink,
                    visibility
                })
            }
        },
        [mutate, board]
    )

    return (
        <DropdownMenuSub open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
                <Users className="size-4" />
                <span>
                    Visibility: <span className="capitalize">{board.visibility}</span>
                </span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {BOARD_VISIBILITY_OPTIONS.map((option) => {
                        const Icon = BOARD_VISIBILITY_ICONS[option.id]
                        const isSelected = board.visibility === option.id
                        const isChanging = isPending && variables?.visibility === option.id

                        return (
                            <DropdownMenuItem
                                key={option.id}
                                className={`flex flex-col items-start gap-1 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
                                disabled={isPending}
                                onSelect={(e) => {
                                    e.preventDefault()
                                    handleChangeVisibility(option.id)
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="size-4" />
                                    <h5>{option.label}</h5>
                                    {isChanging ? (
                                        <span className="ml-auto">
                                            <Spinner size={16} />
                                        </span>
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
