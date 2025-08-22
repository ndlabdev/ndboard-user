'use client'

import { memo, useState } from 'react'
import { ListChecks, Pencil, Trash2, Plus } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { BoardDetailResponse } from '@/types'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from '@/components/ui/select'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BoardCreateCustomFieldFormValues, boardCreateCustomFieldSchema, boardCreateCustomFieldState, useBoardCreateCustomFieldMutation, useBoardCustomFieldsQuery } from '@/features/board'

// preset colors
const OPTION_COLORS = ['red','orange','yellow','green','blue','indigo','purple','pink','gray']

interface Props {
    board: BoardDetailResponse['data']
}

type CustomField = {
    id: string
    name: string
    type: 'text' | 'number' | 'date' | 'checkbox' | 'select'
    showOnCard: boolean
    options?: { id: string; label: string; color: string }[]
}


type Mode = 'list' | 'form'

export const BoardMenuCustomFields = memo(function BoardMenuCustomFields({
    board
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<Mode>('list')
    const [editing, setEditing] = useState<CustomField | null>(null)

    const { data, isLoading } = useBoardCustomFieldsQuery(board.shortLink)
    const fields = data?.data ?? []
    const createMutation = useBoardCreateCustomFieldMutation(board.shortLink)

    const form = useForm<BoardCreateCustomFieldFormValues>({
        resolver: zodResolver(boardCreateCustomFieldSchema),
        defaultValues: boardCreateCustomFieldState
    })
    const { fields: optionFields, append, remove } = useFieldArray({
        control: form.control,
        name: 'options'
    })

    const resetForm = () => {
        form.reset(boardCreateCustomFieldState)
        setEditing(null)
    }

    const handleSave = async (values: BoardCreateCustomFieldFormValues) => {
        await createMutation.mutateAsync(values)
        resetForm()
        setMode('list')
    }

    const handleEdit = (field: CustomField) => {
        setEditing(field)
        form.reset({
            name: field.name,
            type: field.type,
            showOnCard: field.showOnCard,
            options: field.options ?? []
        })
        setMode('form')
    }

    const handleDelete = (id: string) => {
        // setFields((prev) => prev.filter((f) => f.id !== id))
    }

    const handleCancel = () => {
        resetForm()
        setMode('list')
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <ListChecks className="size-5" />
                    Custom Fields
                </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg max-h-[95vh] flex flex-col">
                <DialogHeader className="py-4 border-b">
                    <DialogTitle>
                        {mode === 'list' ? 'Manage Custom Fields' : editing ? 'Edit Field' : 'Add Field'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                    <div className="space-y-4 mb-4 mt-1 px-6">
                        {mode === 'list' && (
                            <>
                                <div className="space-y-2">
                                    {isLoading ? (
                                        <p className="text-sm text-muted-foreground">Loading...</p>
                                    ) : fields.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No custom fields yet.</p>
                                    ) : (
                                        fields.map((f) => (
                                            <div key={f.id} className="flex items-center justify-between border rounded px-3 py-2">
                                                <div>
                                                    <p className="font-medium">{f.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {f.type} {f.showOnCard && '• Shown on card'}
                                                    </p>
                                                    {f.type === 'select' && f.options && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {f.options.map((o) => (
                                                                <span
                                                                    key={o.id}
                                                                    className={`text-xs px-2 py-0.5 rounded-full bg-${o.color}-500 text-white`}
                                                                >
                                                                    {o.label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => setMode('form')}
                                >
                                    <Plus className="size-4 mr-1" /> Add Field
                                </Button>
                            </>
                        )}

                        {mode === 'form' && (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                                    {/* Field Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Field name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter field name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Field Type */}
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Field type</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(val) => {
                                                            field.onChange(val)
                                                            if (val !== 'select') form.setValue('options', [])
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="text">Text</SelectItem>
                                                            <SelectItem value="number">Number</SelectItem>
                                                            <SelectItem value="date">Date</SelectItem>
                                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                                            <SelectItem value="select">Select</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Show on card */}
                                    <FormField
                                        control={form.control}
                                        name="showOnCard"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="font-normal">Show field on front of card</FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Options */}
                                    {form.watch('type') === 'select' && (
                                        <div className="space-y-2">
                                            <FormLabel>Options</FormLabel>
                                            {optionFields.map((opt, index) => (
                                                <div key={opt.id} className="flex items-center gap-2 border rounded p-2">
                                                    <FormField
                                                        control={form.control}
                                                        name={`options.${index}.label`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1">
                                                                <FormControl>
                                                                    <Input placeholder="Option label" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`options.${index}.color`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger className="w-[100px]">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {OPTION_COLORS.map((c) => (
                                                                                <SelectItem key={c} value={c}>
                                                                                    <span className={`inline-block size-3 rounded-full mr-2 bg-${c}-500`} />
                                                                                    {c}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}>
                                                        <Trash2 className="size-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => append({ id: crypto.randomUUID(), label: 'New option', color: 'blue' })}
                                            >
                                                <Plus className="size-4 mr-1" /> Add option
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button type="submit" className="flex-1">
                                            {editing ? 'Update field' : 'Add field'}
                                        </Button>
                                        <Button type="button" variant="secondary" onClick={handleCancel} className="flex-1">
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
