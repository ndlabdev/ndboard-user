'use client'

import { JSX, useRef, useState } from 'react'
import { format } from 'date-fns'
import {
    Calendar as CalendarIcon,
    CheckSquare,
    Hash,
    List as ListIcon,
    ListChecks,
    Type
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { BoardCardsResponse, BoardDetailResponse } from '@/types'
import { useCardUpdateMutation } from '@/features/card'

/** debounce helper */
function debounce<TArgs extends unknown[]>(fn: (..._args: TArgs) => void, ms = 500) {
    let t: ReturnType<typeof setTimeout>
    
    return (...args: TArgs) => {
        clearTimeout(t)
        t = setTimeout(() => fn(...args), ms)
    }
}

const fieldIcons: Record<string, JSX.Element> = {
    text: <Type className="w-4 h-4 text-muted-foreground" />,
    number: <Hash className="w-4 h-4 text-muted-foreground" />,
    date: <CalendarIcon className="w-4 h-4 text-muted-foreground" />,
    checkbox: <CheckSquare className="w-4 h-4 text-muted-foreground" />,
    select: <ListIcon className="w-4 h-4 text-muted-foreground" />
}

interface ItemProps {
  field: BoardDetailResponse['data']['customFields'][number]
  value?: string
  cardId: string
}

function CardCustomFieldItem({ field, value = '', cardId }: ItemProps) {
    const updateMutation = useCardUpdateMutation()
    const [localValue, setLocalValue] = useState(value)

    const debouncedUpdateRef = useRef<((_val: string | null) => void) | null>(null)
    if (!debouncedUpdateRef.current) {
        debouncedUpdateRef.current = debounce((val: string | null) => {
            updateMutation.mutate({
                id: cardId,
                customFields: [{ boardCustomFieldId: field.id, value: val ?? '' }]
            })
        }, 600)
    }
    const debouncedUpdate = debouncedUpdateRef.current

    const handleInstantUpdate = (val: string | null) => {
        setLocalValue(val ?? '')
        updateMutation.mutate({
            id: cardId,
            customFields: [{ boardCustomFieldId: field.id, value: val ?? '' }]
        })
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1 mb-1">
                {fieldIcons[field.type]}
                <span className="text-xs font-semibold text-muted-foreground">
                    {field.name}
                </span>
            </div>

            {/* text */}
            {field.type === 'text' && (
                <Input
                    className="w-full"
                    value={localValue}
                    placeholder="Enter text"
                    onChange={(e) => {
                        setLocalValue(e.target.value)
                        debouncedUpdate(e.target.value || null)
                    }}
                />
            )}

            {/* number */}
            {field.type === 'number' && (
                <Input
                    type="number"
                    className="w-full"
                    value={localValue}
                    placeholder="Enter number"
                    onChange={(e) => {
                        const val = e.target.value
                        setLocalValue(val)
                        if (val === '' || !isNaN(Number(val))) {
                            debouncedUpdate(val || null)
                        }
                    }}
                />
            )}

            {/* checkbox */}
            {field.type === 'checkbox' && (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={localValue === 'true'}
                        onCheckedChange={(checked) => {
                            const v = checked ? 'true' : 'false'
                            handleInstantUpdate(v)
                        }}
                    />
                    <span className="text-sm">
                        {localValue === 'true' ? 'Yes' : 'No'}
                    </span>
                </div>
            )}

            {field.type === 'date' && (
                <Popover modal>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full justify-start text-left font-normal',
                                !localValue && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {localValue
                                ? format(new Date(localValue), 'dd MMM yyyy HH:mm')
                                : 'Pick a date & time'}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-auto p-0 max-h-[80vh] overflow-y-auto"
                        side="right"
                        align="start"
                    >
                        <div className="flex flex-col">
                            {/* Calendar */}
                            <Calendar
                                mode="single"
                                selected={localValue ? new Date(localValue) : undefined}
                                onSelect={(date) => {
                                    if (date) {
                                        const pad = (n: number) => String(n).padStart(2, '0')
                                        const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
                                        const [hh, mm] = localValue
                                            ? localValue.split('T')[1].split(':')
                                            : ['00', '00']
                                        const local = `${base}T${hh}:${mm}`
                                        setLocalValue(local)
                                    }
                                }}
                                className="bg-transparent p-0 [--cell-size:--spacing(10.5)]"
                            />

                            {/* Time input */}
                            <div className="flex items-center gap-2 border-t px-4 py-3 *:[div]:w-full">
                                <Input
                                    type="time"
                                    step="60"
                                    value={localValue ? localValue.split('T')[1].slice(0, 5) : ''}
                                    onChange={(e) => {
                                        const time = e.target.value // "HH:mm"
                                        if (!time) return
                                        const datePart = localValue
                                            ? localValue.split('T')[0]
                                            : new Date().toISOString().split('T')[0]
                                        const local = `${datePart}T${time}`
                                        setLocalValue(local)
                                    }}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between gap-2 border-t px-4 py-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setLocalValue('')
                                        updateMutation.mutate({
                                            id: cardId,
                                            customFields: [{ boardCustomFieldId: field.id, value: '' }]
                                        })
                                    }}
                                >
                                    Clear
                                </Button>

                                <Button
                                    size="sm"
                                    onClick={() => {
                                        updateMutation.mutate({
                                            id: cardId,
                                            customFields: [
                                                { boardCustomFieldId: field.id, value: localValue }
                                            ]
                                        })
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}

            {/* select */}
            {field.type === 'select' && field.options && (
                <Select
                    value={localValue || '--'}
                    onValueChange={(val) =>
                        handleInstantUpdate(val === '--' ? '' : val)
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="--" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="--">--</SelectItem>
                        {field.options.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                                <span
                                    className={`inline-block size-3 rounded-full mr-2 bg-${opt.color}-500`}
                                />
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}

interface Props {
  board: BoardDetailResponse['data']
  card: BoardCardsResponse
}

export function CardCustomFieldsSection({ board, card }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
                <ListChecks className="w-4 h-4" /> Custom Fields
            </h4>

            <div className="grid grid-cols-3 gap-4">
                {board.customFields.map((field) => {
                    const cf = card.customFields?.find((v) => v.id === field.id)
                    
                    return (
                        <CardCustomFieldItem
                            key={field.id}
                            field={field}
                            value={cf?.value}
                            cardId={card.id}
                        />
                    )
                })}
            </div>
        </div>
    )
}
