import { useListMoveMutation } from '@/features/list'
import { BoardListsResponse, BoardCardsResponse } from '@/types'
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
    column: BoardListsResponse
    setColumns: Dispatch<SetStateAction<BoardListsResponse[]>>
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
    workspaceId: string
}

export const ListMove = memo(function ListMove({
    column,
    setColumns,
    setCards,
    workspaceId
}: Props) {
    const [open, setOpen] = useState(false)
    const form = useForm<ListMoveFormValues>({
        resolver: zodResolver(listMoveSchema),
        defaultValues: {
            id: column.id,
            boardId: column.boardId
        }
    })

    const { data: boards, isLoading } = useBoardGetListQuery(workspaceId)
    const boardList = boards?.data ?? []

    const { mutate, isPending } = useListMoveMutation(
        (_data, variables) => {
            const oldBoard = boardList.find((b) => b.id === column.boardId)
            const newBoard = boardList.find((b) => b.id === variables.boardId)
            setColumns((prev) => prev.filter((l) => l.id !== column.id))
            if (setCards) setCards((prev) => prev.filter((card) => card.listId !== column.id))
            toast.success(
                `List "${column.name}" has been moved from board "${oldBoard?.name}" to board "${newBoard?.name}"!`
            )
            setOpen(false)
        }
    )

    const onSubmit = (values: ListMoveFormValues) => {
        mutate(values)
    }

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
