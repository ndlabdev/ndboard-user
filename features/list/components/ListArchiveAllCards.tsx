import { useListArchiveAllCardsMutation } from '@/features/list'
import { BoardListsResponse } from '@/types'
import { memo } from 'react'
import { Loader2Icon } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog'

interface Props {
    column: BoardListsResponse
}

export const ListArchiveAllCards = memo(function ListColumn({
    column
}: Props) {
    const { mutate, isPending } = useListArchiveAllCardsMutation(column)

    const handleArchiveAllCards = () => mutate({ id: column.id })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2Icon className="animate-spin" />
                            Archiving...
                        </>
                    ) : 'Archive all cards in this list'}
                </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirm archive all cards?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This action will <span className="font-semibold text-red-600">archive all cards</span> in the list <span className="font-semibold">{`"${column.name}"`}</span>.<br />
                        You will not be able to undo this operation.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={handleArchiveAllCards}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isPending ? (
                            <>
                                <Loader2Icon className="animate-spin" />
                                Archiving...
                            </>
                        ) : 'Archive'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
})
