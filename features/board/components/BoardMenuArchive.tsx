import { memo } from 'react'
import { Archive } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { BoardDetailResponse } from '@/types'

interface Props {
    board: BoardDetailResponse['data']
    textColor: string
}

export const BoardMenuArchive = memo(function BoardMenuArchive({
}: Props) {
    return (
        <DropdownMenuItem>
            <Archive className="size-5" />
            Archived items
        </DropdownMenuItem>
    )
})
