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
import { WorkspaceCreateFormValues, workspaceCreateSchema, useWorkspaceCreateMutation } from '@/features/workspace'
import { useQueryClient } from '@tanstack/react-query'

export function WorkspaceCreateButton() {
    const queryClient = useQueryClient()
    const form = useForm<WorkspaceCreateFormValues>({
        resolver: zodResolver(workspaceCreateSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    })

    const workspaceMutation = useWorkspaceCreateMutation(
        () => {
            toast.success('Workspace Created Successfully', {
                description: 'Your new workspace has been created.'
            })

            queryClient.invalidateQueries({ queryKey: ['workspaces'] })
        }, (error) => {
            const msg =
                (error as { message?: string })?.message ||
                'Create Workspace Failed'

            toast.error(msg)
        }
    )

    const onSubmit = (values: WorkspaceCreateFormValues) => {
        workspaceMutation.mutate(values)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full" size="sm">
                    <Plus />
                    Create New Workspace
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[576px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Create New Workspace</DialogTitle>

                            <DialogDescription>
                                A workspace helps you organize your projects, boards, and team members. Enter a name and description to get started.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 mt-4">
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

                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button type="submit" disabled={form.formState.isSubmitting || workspaceMutation.isPending}>
                                {workspaceMutation.isPending ? (
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
