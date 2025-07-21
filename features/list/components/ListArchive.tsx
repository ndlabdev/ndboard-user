import { useListArchiveMutation } from '@/features/list'
import { BoardDetailResponse, BoardListsResponse } from '@/types'
import { memo, useCallback } from 'react'
import { Loader2Icon } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface Props {
    board: BoardDetailResponse['data']
    column: BoardListsResponse
}

export const ListArchive = memo(function ListColumn({
    board,
    column
}: Props) {
    const { mutate, isPending } = useListArchiveMutation(column.id, board.shortLink)

    const handleArchive = useCallback(() => {
        mutate({ id: column.id })
    }, [mutate, column.id])

    return (
        <DropdownMenuItem onClick={handleArchive} disabled={isPending}>
            {isPending ? (
                <>
                    <Loader2Icon className="animate-spin" />
                    Archiving...
                </>
            ) : 'Archive this list'}
        </DropdownMenuItem>
    )
})
