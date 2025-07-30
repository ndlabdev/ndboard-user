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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { BoardLabelCreateFormValues, boardLabelCreateSchema, boardLabelCreateState, LABEL_COLORS, LABEL_TONES, useBoardCreateLabelsMutation } from '@/features/board'
import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { BoardDetailResponse } from '@/types'

interface Props {
    board: BoardDetailResponse['data']
}

export function BoardMenuLabelForm({ board }: Props) {
    const [open, setOpen] = useState(false)
    const form = useForm<BoardLabelCreateFormValues>({
        resolver: zodResolver(boardLabelCreateSchema),
        defaultValues: {
            ...boardLabelCreateState,
            boardId: board.id
        }
    })

    const { mutate, isPending, isSuccess } = useBoardCreateLabelsMutation(board.shortLink, () => {
        setOpen(false)
    })

    const onSubmit = (values: BoardLabelCreateFormValues) => mutate(values)

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
                                    <div className="col-span-12 flex items-center gap-2 min-h-8">
                                        {form.watch('color') ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span
                                                        className={`
                                                    inline-flex items-center px-3 py-2 rounded font-semibold text-xs w-full min-h-8
                                                    ${LABEL_COLORS.find((c) => c.name === form.watch('color'))?.[form.watch('tone')] || ''}
                                                    transition-colors duration-150
                                                `}
                                                    >
                                                        {form.watch('name')}
                                                    </span>
                                                </TooltipTrigger>

                                                <TooltipContent side="bottom">
                                                    <span>
                                                        Color: {form.watch('tone') === 'normal'
                                                            ? form.watch('color')
                                                            : `${form.watch('tone')} ${form.watch('color')}`}, title: {form.watch('name') || 'None'}
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-2 min-h-8 rounded font-semibold w-full text-xs bg-gray-100 text-gray-400"></span>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-12">
                                    <Separator />
                                </div>

                                <div className="col-span-12">
                                    <FormField
                                        control={form.control}
                                        name="name"
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

                                <div className="col-span-12">
                                    <FormField
                                        control={form.control}
                                        name="color"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select a color</FormLabel>
                                                <FormControl>
                                                    <div className={`grid grid-cols-${LABEL_COLORS.length / 2} gap-2`}>
                                                        {LABEL_TONES.map((tone) =>
                                                            LABEL_COLORS.map((color) => {
                                                                const checked =
                                                                    form.watch('color') === color.name && form.watch('tone') === tone
                                                                    
                                                                return (
                                                                    <Tooltip key={color.name + '-' + tone}>
                                                                        <TooltipTrigger asChild>
                                                                            <button
                                                                                type="button"
                                                                                aria-label={`${tone} ${color.name}`}
                                                                                role="radio"
                                                                                aria-checked={checked}
                                                                                className={`
                                                                                w-full h-9 rounded shadow transition border
                                                                                ${color[tone]}
                                                                                ${checked ? 'ring-2 ring-blue-500 border-blue-500' : 'border-transparent'}
                                                                                focus:outline-none
                                                                            `}
                                                                                onClick={() => {
                                                                                    field.onChange(color.name)
                                                                                    form.setValue('tone', tone)
                                                                                }}
                                                                            >
                                                                                {checked && (
                                                                                    <svg
                                                                                        className="w-5 h-5 mx-auto text-white"
                                                                                        fill="none"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth={3}
                                                                                        viewBox="0 0 24 24"
                                                                                    >
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                    </svg>
                                                                                )}
                                                                            </button>
                                                                        </TooltipTrigger>

                                                                        <TooltipContent side="bottom">
                                                                            <p>{tone === 'normal' ? color.name : `${tone} ${color.name}`}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )
                                                            })
                                                        )}
                                                    </div>
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
                                <Button variant="outline" size="sm">Cancel</Button>
                            </DialogClose>

                            <Button type="submit" size="sm" disabled={form.formState.isSubmitting || isPending}>
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
