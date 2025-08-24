'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Loader2Icon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { BOARD_VISIBILITY_OPTIONS, BoardBackgroundPicker, BoardCreateFormValues, boardCreateSchema, boardCreateState, useBoardCreateMutation } from '@/features/board'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from '@bprogress/next/app'

interface Props {
    workspaceId: string
}

export function BoardCreateFirst({ workspaceId }: Props) {
    const router = useRouter()
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
            setOpen(false)
            router.push(`/b/${data.shortLink}/${data.slug}`)
        }
    )

    const onSubmit = (values: BoardCreateFormValues) => mutate(values)

    useEffect(() => {
        if (isSuccess) form.reset()
    }, [isSuccess, form])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full rounded-xl bg-default hover:bg-default border border-dashed border-primary/40 hover:border-primary transition flex flex-col items-center justify-center min-h-[140px] outline-none capitalize h-full" size="sm">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Plus className="size-8 text-primary mb-2" />
                        <div className="font-semibold text-base text-primary">
                            Create new board
                        </div>
                    </div>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl max-h-[95vh] flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <DialogHeader className="py-4 border-b">
                            <DialogTitle>Create New Board</DialogTitle>

                            <DialogDescription>
                                A board helps you organize tasks, track progress, and collaborate with your team. Give your board a name and start managing your workflow effectively.
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                            <div className="grid gap-4 my-4 px-6">
                                <div className="col-span-12">
                                    <FormField
                                        control={form.control}
                                        name="coverImageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Background</FormLabel>
                                                <FormControl>
                                                    <BoardBackgroundPicker
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-12">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Board Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter board name"
                                                        aria-placeholder="Enter board name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-12">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter board description"
                                                        aria-placeholder="Enter board description"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-12">
                                    <FormField
                                        control={form.control}
                                        name="visibility"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Visibility</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Visibility">
                                                                {BOARD_VISIBILITY_OPTIONS.find((opt) => opt.id === field.value)?.label}
                                                            </SelectValue>
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            {BOARD_VISIBILITY_OPTIONS.map((item) => (
                                                                <SelectItem key={item.id} value={item.id}>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{item.label}</span>
                                                                        <span className="text-xs text-muted-foreground">{item.description}</span>
                                                                    </div>
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
                                ) : 'Create Board'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
