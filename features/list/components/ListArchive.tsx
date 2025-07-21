import { useListArchiveMutation } from '@/features/list'
import { BoardDetailResponse, BoardListsResponse } from '@/types'
import { memo, useCallback } from 'react'
import { Loader2Icon } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
    board: BoardDetailResponse['data']
    column: BoardListsResponse
}

export const ListArchive = memo(function ListColumn({
    board,
    column
}: Props) {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useListArchiveMutation(() => {
        queryClient.setQueryData(['boards', board.shortLink], (old: BoardDetailResponse) => {
            if (!old?.data?.lists) return old

            return {
                ...old,
                data: {
                    ...old.data,
                    lists: old.data.lists.filter((l) => l.id !== column.id)
                }
            }
        })
        toast.success('List archived successfully!')
    })

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
