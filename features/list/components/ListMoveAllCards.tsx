import { ListMoveAllCardsFormValues, listMoveAllCardsSchema, useListMoveAllCardsMutation } from '@/features/list'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

interface Props {
    column: BoardListsResponse
    columns: BoardListsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const ListMoveAllCards = memo(function ListMove({
    column,
    columns,
    setCards,
    setIsMenuOpen
}: Props) {
    const [open, setOpen] = useState(false)
    const form = useForm<ListMoveAllCardsFormValues>({
        resolver: zodResolver(listMoveAllCardsSchema),
        defaultValues: {
            id: column.id,
            targetListId: ''
        }
    })

    const { mutate, isPending } = useListMoveAllCardsMutation(
        (_data, variables) => {
            const fromList = columns.find((list) => list.id === variables.id)
            const toList = columns.find((list) => list.id === variables.targetListId)
            if (setCards) setCards((prev) =>
                prev.map((card) =>
                    card.listId === variables.id
                        ? { ...card, listId: variables.targetListId }
                        : card
                )
            )
            toast.success(
                `All cards have been moved from list "${fromList?.name}" to list "${toList?.name}".`
            )
            setOpen(false)
            setIsMenuOpen(false)
        },
        () => {
            toast.error('Failed to move cards. Please try again!')
        }
    )

    const onSubmit = (values: ListMoveAllCardsFormValues) => {
        mutate(values)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Move all cards in this list
                </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm max-h-[95vh] flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <DialogHeader className="py-4 border-b">
                            <DialogTitle>Move All Cards</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 my-4 px-6">
                            <div className="col-span-12">
                                <FormField
                                    control={form.control}
                                    name="targetListId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select list</FormLabel>

                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={isPending}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select list" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {columns
                                                            .filter((list) => list.id !== column.id)
                                                            .map((list) => (
                                                                <SelectItem key={list.id} value={list.id}>
                                                                    {list.name}
                                                                </SelectItem>
                                                            ))}
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
