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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
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
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BOARD_VISIBILITY_OPTIONS } from '../constants'

export function WorkspaceCreateButton() {
    const queryClient = useQueryClient()
    const form = useForm<WorkspaceCreateFormValues>({
        resolver: zodResolver(workspaceCreateSchema),
        defaultValues: workspaceCreateState
    })

    const { mutate, isPending, isSuccess } = useWorkspaceCreateMutation(
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

    const onSubmit = (values: WorkspaceCreateFormValues) => mutate(values)

    useEffect(() => {
        if (isSuccess) form.reset()
    }, [isSuccess, form])

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

                        <DialogFooter className="mt-4">
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
