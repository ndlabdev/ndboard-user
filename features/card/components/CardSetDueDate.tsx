'use client'

import * as React from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { useCardUpdateMutation } from '@/features/card'
import type { BoardCardsResponse } from '@/types'
import { isBefore, isToday, isWithinInterval, addDays, format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

interface Props {
    card: BoardCardsResponse
}

export function CardSetDueDate({ card }: Props) {
    const [open, setOpen] = React.useState(false)
    const [enableStart, setEnableStart] = React.useState(!!card.startDate)
    const [enableDue, setEnableDue] = React.useState(!!card.dueDate)

    const [range, setRange] = React.useState<DateRange | undefined>({
        from: card.startDate ? new Date(card.startDate) : undefined,
        to: card.dueDate ? new Date(card.dueDate) : undefined
    })

    const { mutate } = useCardUpdateMutation()

    const handleSave = () => {
        const startDate =
            enableStart && range?.from ? range.from.toISOString() : null
        const dueDate =
            enableDue && (enableStart ? range?.to ?? range?.from : range?.from)
                ? (enableStart ? (range?.to ?? range?.from) : range?.from)!.toISOString()
                : null

        mutate({
            id: card.id,
            startDate,
            dueDate
        })
        setOpen(false)
    }

    const handleClear = () => {
        setRange(undefined)
        setEnableStart(false)
        setEnableDue(false)
        mutate({ id: card.id, startDate: null, dueDate: null })
        setOpen(false)
    }

    const now = new Date()
    const dueDate = enableDue
        ? enableStart
            ? range?.to ?? range?.from
            : range?.from ?? range?.to
        : undefined
    
    let statusClass = ''
    if (dueDate) {
        if (isBefore(dueDate, now) && !isToday(dueDate)) {
            statusClass = 'bg-red-100 text-red-600 border-red-200'
        } else if (
            isWithinInterval(dueDate, { start: now, end: addDays(now, 1) })
        ) {
            statusClass = 'bg-amber-100 text-amber-600 border-amber-200'
        } else {
            statusClass = 'bg-green-100 text-green-600 border-green-200'
        }
    }

    const renderLabel = () => {
        if (!dueDate) return 'Set dates'
        if (enableStart && range?.from && range?.to) {
            return `${format(range.from, 'dd MMM yyyy')} → ${format(range.to, 'dd MMM yyyy')}`
        }
        
        return format(dueDate, 'dd MMM yyyy')
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                        'flex items-center gap-2',
                        dueDate && statusClass
                    )}
                >
                    <CalendarIcon className="size-4" />
                    {renderLabel()}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                side="right"
                className="max-h-[80vh] overflow-y-auto w-80"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex justify-center mb-3 gap-4">
                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={enableStart}
                                onCheckedChange={(val) => setEnableStart(val === true)}
                            />
                            <span className="text-sm font-medium">Start date</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <Checkbox
                                checked={enableDue}
                                onCheckedChange={(val) => setEnableDue(val === true)}
                            />
                            <span className="text-sm font-medium">Due date</span>
                        </label>
                    </div>

                    {enableStart ? (
                        <Calendar
                            mode="range"
                            selected={range as DateRange | undefined}
                            onSelect={(val) => setRange(val as DateRange | undefined)}
                            autoFocus
                            className='p-0 w-full'
                        />
                    ) : (
                        <Calendar
                            mode="single"
                            selected={range?.from as Date | undefined}
                            onSelect={(val) =>
                                setRange(val ? { from: val as Date, to: val as Date } : undefined)
                            }
                            autoFocus
                            className='p-0 w-full'
                        />
                    )}

                    <div className="flex justify-between pt-2 border-t">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleClear}
                        >
                            <X className="mr-1 h-4 w-4" /> Clear
                        </Button>

                        <Button size="sm" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
