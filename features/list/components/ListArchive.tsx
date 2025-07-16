import { useListArchiveMutation } from '@/features/list'
import { BoardCardsResponse, BoardListsResponse } from '@/types'
import { Dispatch, memo, SetStateAction } from 'react'
import { Loader2Icon } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface Props {
    column: BoardListsResponse
    setColumns: Dispatch<SetStateAction<BoardListsResponse[]>>
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
}

export const ListArchive = memo(function ListColumn({
    column,
    setColumns,
    setCards
}: Props) {
    const { mutate, isPending } = useListArchiveMutation(() => {
        setColumns((prev) => prev.filter((l) => l.id !== column.id))
        if (setCards) {
            setCards((prev) => prev.filter((card) => card.listId !== column.id))
        }
        toast.success('List archived successfully!')
    })

    const handleArchive = () => {
        mutate({ id: column.id })
    }

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
