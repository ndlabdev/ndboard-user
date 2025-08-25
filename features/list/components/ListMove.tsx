import { useListMoveMutation } from '@/features/list'
import { BoardListsResponse, BoardDetailResponse } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Dispatch, memo, SetStateAction, useState } from 'react'
import { listMoveSchema, ListMoveFormValues } from '@/features/list'
import { useBoardGetListQuery } from '@/features/board'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

interface Props {
    board: BoardDetailResponse['data']
    column: BoardListsResponse
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const ListMove = memo(function ListMove({
    board,
    column,
    setIsMenuOpen
}: Props) {
    const [open, setOpen] = useState(false)
    const form = useForm<ListMoveFormValues>({
        resolver: zodResolver(listMoveSchema),
        defaultValues: {
            id: column.id,
            boardId: column.boardId
        }
    })

    const { data: boards, isLoading } = useBoardGetListQuery(board.workspaceId)
    const boardList = boards?.data ?? []
    const getShortLink = (boardId: string) =>
        boardList.find((b) => b.id === boardId)?.shortLink || ''

    const oldShortLink = getShortLink(column.boardId)
    const newShortLink = form.watch('boardId') ? getShortLink(form.watch('boardId')) : ''

    const { mutate, isPending } = useListMoveMutation(
        oldShortLink,
        newShortLink,
        () => {
            const oldBoard = boardList.find((b) => b.id === column.boardId)
            const newBoard = boardList.find((b) => b.id === form.getValues('boardId'))
            toast.success(
                `List "${column.name}" has been moved from board "${oldBoard?.name}" to board "${newBoard?.name}"!`
            )
            setOpen(false)
            setIsMenuOpen(false)
        },
        (error) => {
            const msg =
                (error as { message?: string })?.message ||
                'Move list failed!'

            toast.error(msg)
        }
    )

    const onSubmit = async (values: ListMoveFormValues) => mutate(values)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Move list
                </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm max-h-[95vh] flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <DialogHeader className="py-4 border-b">
                            <DialogTitle>Move List</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 my-4 px-6">
                            <div className="col-span-12">
                                <FormField
                                    control={form.control}
                                    name="boardId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select board</FormLabel>

                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={isPending || isLoading || !boards}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={isLoading ? 'Loading boards...' : 'Select board'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {isLoading && (
                                                            <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
                                                                <Loader2Icon className="animate-spin w-4 h-4" /> Loading boards...
                                                            </div>
                                                        )}
                                                        {!isLoading && boardList.length === 0 && (
                                                            <div className="p-2 text-sm text-muted-foreground">No boards available</div>
                                                        )}
                                                        {!isLoading && boardList.length > 0 && (
                                                            boardList.map((board) => (
                                                                <SelectItem key={board.id} value={board.id}>
                                                                    {board.name}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="py-4 border-t">
                            <DialogClose asChild>
                                <Button variant="outline" size="sm">Cancel</Button>
                            </DialogClose>

                            <Button type="submit" size="sm" disabled={form.formState.isSubmitting || isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2Icon className="animate-spin" />
                                        Moving...
                                    </>
                                ) : 'Move'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
})
