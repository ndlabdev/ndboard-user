import { ListCopyFormValues, listCopySchema, useListCopyMutation } from '@/features/list'
import { BoardCardsResponse, BoardListsResponse } from '@/types'
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'

interface Props {
    column: BoardListsResponse
    setColumns: Dispatch<SetStateAction<BoardListsResponse[]>>
    cards: BoardCardsResponse[]
    setCards?: Dispatch<SetStateAction<BoardCardsResponse[]>>
}

export const ListCopy = memo(function ListColumn({
    column,
    setColumns,
    cards,
    setCards
}: Props) {
    const [open, setOpen] = useState(false)
    const form = useForm<ListCopyFormValues>({
        resolver: zodResolver(listCopySchema),
        defaultValues: {
            id: column.id,
            name: `${column.name} (Copy)`
        }
    })

    const { mutate, isPending, isSuccess } = useListCopyMutation(
        ({ data }) => {
            setColumns((prev) => {
                const idx = prev.findIndex((l) => l.id === column.id)
                const arr = [...prev]
                arr.splice(idx + 1, 0, data)

                return arr
            })
            if (
                setCards &&
                cards &&
                data.cardIds &&
                data.cardIds.length === cards.filter((card) => card.listId === column.id).length
            ) {
                const oldListCards = cards.filter((card) => card.listId === column.id)
                setCards((prevCards) => [
                    ...prevCards,
                    ...oldListCards.map((card, idx) => {
                        console.log(data.cardIds[idx])

                        return {
                            ...card,
                            id: data.cardIds[idx],
                            listId: data.id
                        }
                    })
                ])
            }
            setOpen(false)
        }
    )

    const onSubmit = (values: ListCopyFormValues) => mutate(values)

    useEffect(() => {
        if (isSuccess) form.reset()
    }, [isSuccess, form])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Copy list
                </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm max-h-[95vh] flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <DialogHeader className="py-4 border-b">
                            <DialogTitle>Copy List</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 my-4 px-6">
                            <div className="col-span-12">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter name"
                                                    aria-placeholder="Enter name"
                                                    {...field}
                                                />
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
                                        Loading...
                                    </>
                                ) : 'Create List'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
})
