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
import { zodResolver } from '@hookform/resolvers/zod'
import { WorkspaceCreateFormValues, workspaceCreateSchema, useWorkspaceCreateMutation, workspaceCreateState } from '@/features/workspace'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function WorkspaceCreateButton() {
    const [open, setOpen] = useState(false)
    const form = useForm<WorkspaceCreateFormValues>({
        resolver: zodResolver(workspaceCreateSchema),
        defaultValues: workspaceCreateState
    })

    const { mutate, isPending, isSuccess } = useWorkspaceCreateMutation(() => setOpen(false))

    const onSubmit = (values: WorkspaceCreateFormValues) => mutate(values)

    useEffect(() => {
        if (isSuccess) form.reset()
    }, [isSuccess, form])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full" size="sm">
                    <Plus />
                    Create New Workspace
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl max-h-[95vh] flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <DialogHeader className="py-4 border-b">
                            <DialogTitle>Create New Workspace</DialogTitle>

                            <DialogDescription>
                                A workspace helps you organize your projects, boards, and team members. Enter a name and description to get started.
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                            <div className="grid gap-4 my-4 px-6">
                                <div className="col-span-12">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Workspace Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter workspace name"
                                                        aria-placeholder="Enter workspace name"
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
                                                <FormLabel>Workspace Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter workspace description"
                                                        aria-placeholder="Enter workspace description"
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
                                ) : 'Create Workspace'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
