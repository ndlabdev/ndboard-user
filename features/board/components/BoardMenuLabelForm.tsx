'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Loader2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BoardCreateFormValues, boardCreateSchema, boardCreateState, useBoardCreateMutation } from '@/features/board'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
    workspaceId: string
}

export function BoardMenuLabelForm({ workspaceId }: Props) {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const form = useForm<BoardCreateFormValues>({
        resolver: zodResolver(boardCreateSchema),
        defaultValues: {
            ...boardCreateState,
            workspaceId
        }
    })

    const { mutate, isPending, isSuccess } = useBoardCreateMutation(
        ({ data }) => {
            toast.success('Board Created Successfully', {
                description: 'Your new board is ready. Start organizing your tasks and collaborate with your team.'
            })

            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['boards'] })
        }, (error) => {
            const msg =
                (error as { message?: string })?.message ||
                'Create Board Failed'

            toast.error(msg)
        }
    )

    const onSubmit = (values: BoardCreateFormValues) => mutate(values)

    useEffect(() => {
        if (isSuccess) form.reset()
    }, [isSuccess, form])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    size="sm"
                >
                    Create a new label
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md max-h-[95vh] flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <DialogHeader className="py-4 border-b">
                            <DialogTitle>Create a new label</DialogTitle>
                        </DialogHeader>

                        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                            <div className="grid gap-4 my-4 px-6">
                                <div className="col-span-12">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter title"
                                                        aria-placeholder="Enter title"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </ScrollArea>

                        <DialogFooter className="py-4 border-t">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button type="submit" disabled={form.formState.isSubmitting || isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2Icon className="animate-spin" />
                                        Loading...
                                    </>
                                ) : 'Create Label'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
