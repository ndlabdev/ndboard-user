'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import { useEffect, useState } from 'react'
import type { BoardDetailResponse } from '@/types'
import { useCardCreateMutation } from '@/features/card'
import { toast } from 'sonner'

interface QuickCreateCardPopoverProps {
    board: BoardDetailResponse['data']
    anchorEl: HTMLElement | null
    open: boolean
    startDateProps: Date | null
    dueDateProps: Date | null
    onOpenChange: (_v: boolean) => void
}

export function CalendarCreateCard({
    board,
    anchorEl,
    open,
    onOpenChange,
    startDateProps,
    dueDateProps
}: QuickCreateCardPopoverProps) {
    const [title, setTitle] = useState('')
    const [listId, setListId] = useState<string>(board.lists?.[0]?.id ?? '')
    const [enableStart, setEnableStart] = useState(false)
    const [enableDue, setEnableDue] = useState(true)
    const [range, setRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date()
    })
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [dueDate, setDueDate] = useState<Date | null>(null)

    useEffect(() => {
        if (open) {
            setStartDate(startDateProps)
            setDueDate(dueDateProps)
            setRange(
                startDateProps || dueDateProps
                    ? { from: startDateProps ?? dueDateProps ?? undefined,
                        to: dueDateProps ?? startDateProps ?? undefined }
                    : undefined
            )
        }
    }, [open, startDateProps, dueDateProps])

    const { mutate: createCard, isPending } = useCardCreateMutation(
        () => {
            setTitle('')
            onOpenChange(false)
        }
    )

    const handleCreate = () => {
        createCard({
            name: title,
            listId,
            startDate: enableStart && range?.from ? range.from.toISOString() : null,
            dueDate: enableDue
                ? enableStart
                    ? range?.to
                        ? range.to.toISOString()
                        : range?.from?.toISOString() ?? null
                    : dueDate?.toISOString()
                : null
        })
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            {anchorEl && (
                <PopoverTrigger asChild>
                    <div
                        ref={(el) => {
                            if (el && anchorEl) {
                                anchorEl.appendChild(el)
                            }
                        }}
                    />
                </PopoverTrigger>
            )}
            <PopoverContent side="top" align="center" className="size-96 p-4 overflow-y-auto">
                <div className="flex flex-col gap-3 p-1">
                    {/* Title */}
                    <Input
                        placeholder="Card title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Select list */}
                    <Select value={listId} onValueChange={setListId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select list" />
                        </SelectTrigger>
                        <SelectContent>
                            {board.lists?.map((l) => (
                                <SelectItem key={l.id} value={l.id}>
                                    {l.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Checkboxes */}
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={enableStart}
                                onCheckedChange={(val) => setEnableStart(val === true)}
                            />
                            <span className="text-sm">Start</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={enableDue}
                                onCheckedChange={(val) => setEnableDue(val === true)}
                            />
                            <span className="text-sm">Due</span>
                        </label>
                    </div>

                    {/* Calendar */}
                    {enableStart && enableDue ? (
                    // Range picker
                        <Calendar
                            mode="range"
                            selected={range as DateRange | undefined}
                            onSelect={(val) => setRange(val as DateRange | undefined)}
                            className="p-0 w-full"
                        />
                    ) : (
                    // Single picker
                        <Calendar
                            mode="single"
                            selected={
                                enableStart
                                    ? startDate ?? undefined
                                    : enableDue
                                        ? dueDate ?? undefined
                                        : undefined
                            }
                            onSelect={(val) => {
                                if (!val) return
                                if (enableStart) {
                                    setStartDate(val)
                                    setRange((prev) => ({ from: val, to: prev?.to }))
                                } else if (enableDue) {
                                    setDueDate(val)
                                    setRange((prev) => ({ from: prev?.from, to: val }))
                                } else {
                                    setStartDate(val)
                                    setDueDate(val)
                                }
                            }}
                            className="p-0 w-full"
                        />
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>

                        <Button size="sm" onClick={handleCreate} disabled={!title || isPending}>
                            {isPending ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
