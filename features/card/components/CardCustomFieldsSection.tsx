'use client'

import { JSX, useMemo } from 'react'
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

/** Generic debounce */
function debounce<TArgs extends unknown[]>(
    fn: (..._args: TArgs) => void,
    ms = 400
) {
    let t: ReturnType<typeof setTimeout> | undefined
    
    return (...args: TArgs) => {
        if (t) clearTimeout(t)
        t = setTimeout(() => fn(...args), ms)
    }
}

interface Props {
  board: BoardDetailResponse['data']
  card: BoardCardsResponse
}

const fieldIcons: Record<string, JSX.Element> = {
    text: <Type className="w-4 h-4 text-muted-foreground" />,
    number: <Hash className="w-4 h-4 text-muted-foreground" />,
    date: <CalendarIcon className="w-4 h-4 text-muted-foreground" />,
    checkbox: <CheckSquare className="w-4 h-4 text-muted-foreground" />,
    select: <ListIcon className="w-4 h-4 text-muted-foreground" />
}

export function CardCustomFieldsSection({ board, card }: Props) {
    const updateMutation = useCardUpdateMutation()

    // debounce ổn định giữa các render
    const handleUpdateDebounced = useMemo(
        () =>
            debounce((fieldId: string, value: string | null) => {
                updateMutation.mutate({
                    id: card.id,
                    customFields: [{ boardCustomFieldId: fieldId, value: value ?? '' }]
                })
            }, 600),
        [card.id, updateMutation]
    )

    const handleUpdate = (fieldId: string, value: string | null) => {
        updateMutation.mutate({
            id: card.id,
            customFields: [{ boardCustomFieldId: fieldId, value: value ?? '' }]
        })
    }

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
                <ListChecks className="w-4 h-4" /> Custom Fields
            </h4>

            <div className="grid grid-cols-3 gap-4">
                {board.customFields.map((field) => {
                    const cf = card.customFields?.find((v) => v.id === field.id)
                    const value = cf?.value ?? ''

                    return (
                        <div key={field.id} className="flex flex-col gap-1 w-full">
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
                                    value={value}
                                    placeholder="Enter text"
                                    onChange={(e) =>
                                        handleUpdateDebounced(field.id, e.target.value || null)
                                    }
                                />
                            )}

                            {/* number */}
                            {field.type === 'number' && (
                                <Input
                                    type="number"
                                    className="w-full"
                                    value={value}
                                    placeholder="Enter number"
                                    onChange={(e) => {
                                        const val = e.target.value
                                        if (val === '') {
                                            handleUpdateDebounced(field.id, null)
                                        } else if (!isNaN(Number(val))) {
                                            handleUpdateDebounced(field.id, val)
                                        }
                                    }}
                                />
                            )}

                            {/* checkbox */}
                            {field.type === 'checkbox' && (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={value === 'true'}
                                        onCheckedChange={(checked) => {
                                            const v = checked === true ? 'true' : 'false'
                                            handleUpdate(field.id, v)
                                        }}
                                    />
                                    <span className="text-sm">
                                        {value === 'true' ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            )}

                            {/* date */}
                            {field.type === 'date' && (
                                <Popover modal>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !value && 'text-muted-foreground'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {value
                                                ? format(new Date(value), 'dd MMM yyyy')
                                                : 'Pick a date'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={value ? new Date(value) : undefined}
                                            onSelect={(date) =>
                                                handleUpdate(field.id, date ? date.toISOString() : null)
                                            }
                                        />
                                        <div className="p-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleUpdate(field.id, null)}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}

                            {/* select */}
                            {field.type === 'select' && field.options && (
                                <Select
                                    value={value || '--'}
                                    onValueChange={(val) =>
                                        handleUpdate(field.id, val === '--' ? null : val)
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
                })}
            </div>
        </div>
    )
}
