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
import { Edit2 } from 'lucide-react'
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
import { useRouter } from '@bprogress/next/app'
import { WorkspaceEditFormValues, useWorkspaceEditMutation, workspaceEditSchema } from '@/features/workspace'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
    id: string
    name: string
    slug: string
    description?: string | undefined
}

export function WorkspaceEditButton(props: Props) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const form = useForm<WorkspaceEditFormValues>({
        resolver: zodResolver(workspaceEditSchema),
        defaultValues: props
    })

    const { mutate, isPending } = useWorkspaceEditMutation(
        (data) => {
            toast.success('Workspace Updated Successfully', {
                description: 'Your workspace information has been updated.'
            })

            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['workspaces'] })
            if (props.slug !== data.data.slug) router.push(`/w/${data.data.slug}/boards`)
        }, (error) => {
            const msg =
                (error as { message?: string })?.message ||
                'Update Workspace Failed'

            toast.error(msg)
        }
    )

    const onSubmit = (values: WorkspaceEditFormValues) => mutate(values)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                    <Edit2 />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl max-h-[95vh] flex flex-col">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                        <DialogHeader className="py-4 border-b">
                            <DialogTitle>Edit Workspace</DialogTitle>

                            <DialogDescription>
                                Update your workspace name and description below.
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
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Workspace URL</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter workspace URL"
                                                        aria-placeholder="Enter workspace URL"
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
                                ) : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
