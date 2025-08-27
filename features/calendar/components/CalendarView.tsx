'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { BoardDetailResponse, BoardLabelResponse } from '@/types'
import { CalendarCreateCard, useCalendarViewBoardQuery } from '@/features/calendar'
import { Card } from '@/components/ui/card'
import { CardItem, useCardUpdateMutation } from '@/features/card'
import { useRef, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getLabelClass } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
    board: BoardDetailResponse['data']
}

export function CalendarView({ board }: Props) {
    const { data, isLoading, isError } = useCalendarViewBoardQuery(board.id)
    const { mutate } = useCardUpdateMutation()

    const [selectedList, setSelectedList] = useState<string | null>(null)
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
    const [selectedMember, setSelectedMember] = useState<string | null>(null)
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [startDate, setStartDate] = useState<Date>(new Date())
    const [dueDate, setDueDate] = useState<Date>(new Date())
    const lastClick = useRef<number | null>(null)

    if (isLoading) {
        return <div className="p-4">Loading calendar...</div>
    }

    if (isError || !data) {
        return <div className="p-4 text-destructive">Failed to load calendar</div>
    }

    const events = data.data
        .filter((c) => !selectedList || c.listId === selectedList)
        .filter((c) => !selectedLabel || c.labels?.some((l) => l.id === selectedLabel))
        .filter((c) => !selectedMember || c.assignees?.some((a) => a.id === selectedMember))
        .map((c) => {
            const start = c.startDate ?? c.dueDate ?? undefined
            const end = c.dueDate ? new Date(c.dueDate) : undefined
            const endDate = end ? new Date(end.getTime() + 24 * 60 * 60 * 1000) : undefined
  
            return {
                id: c.id,
                title: c.name,
                start,
                end: endDate,
                allDay: !c.startDate || (c.startDate === c.dueDate),
                extendedProps: {
                    card: {
                        id: c.id
                    },
                    listId: c.listId,
                    listName: c.listName,
                    labels: c.labels,
                    assignees: c.assignees
                }
            }
        })

    return (
        <div className="p-4 h-full flex flex-col gap-4">
            {/* Header */}
            <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">Calendar Filters</h2>

                <div className="flex flex-wrap gap-4">
                    {/* Filter by List */}
                    <Select
                        value={selectedList ?? 'all'}
                        onValueChange={(v) => setSelectedList(v === 'all' ? null : v)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by List" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Lists</SelectItem>
                            {Array.from(
                                new Map(
                                    data.data.map((c) => [c.listId, c.listName])
                                ).entries()
                            ).map(([id, name]) => (
                                <SelectItem key={id} value={id}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Filter by Label */}
                    <Select
                        value={selectedLabel ?? 'all'}
                        onValueChange={(v) => setSelectedLabel(v === 'all' ? null : v)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by Label" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Labels</SelectItem>
                            {Array.from(
                                new Map(
                                    data.data
                                        .flatMap((c) => c.labels ?? [])
                                        .map((l) => [l.id, l.name])
                                ).entries()
                            ).map(([id, name]) => (
                                <SelectItem key={id} value={id}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Filter by Member */}
                    <Select
                        value={selectedMember ?? 'all'}
                        onValueChange={(v) => setSelectedMember(v === 'all' ? null : v)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by Member" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Members</SelectItem>
                            {Array.from(
                                new Map(
                                    data.data
                                        .flatMap((c) => c.assignees ?? [])
                                        .map((u) => [u.id, u.name])
                                ).entries()
                            ).map(([id, name]) => (
                                <SelectItem key={id} value={id}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Calendar */}
            <Card className="flex-1 p-2">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    selectable={true}
                    events={events}
                    height="100%"
                    editable={true}
                    eventDrop={(info) => {
                        mutate({
                            id: info.event.id,
                            startDate: info.event.start?.toISOString() ?? null,
                            dueDate:
                                info.event.end?.toISOString() ??
                                info.event.start?.toISOString() ??
                                null
                        })
                    }}
                    eventResize={(info) => {
                        mutate({
                            id: info.event.id,
                            startDate: info.event.start?.toISOString() ?? null,
                            dueDate: info.event.end?.toISOString() ?? null
                        })
                    }}
                    eventContent={(arg) => {
                        const labels = arg.event.extendedProps['labels'] as BoardLabelResponse[]
                        const assignees = arg.event.extendedProps['assignees'] as {
                            id: string
                            name: string
                            avatarUrl?: string | null
                        }[] | undefined

                        return (
                            <CardItem
                                card={arg.event.extendedProps['card']}
                                board={board}
                            >
                                <div className="flex flex-col gap-1">
                                    {/* labels */}
                                    {labels && labels.length > 0 && (
                                        <ul className="flex flex-wrap gap-1">
                                            {labels.map((l) => (
                                                <li
                                                    key={l.id}
                                                    className={`h-4 px-1 text-[10px] font-semibold rounded ${getLabelClass(l.color, l.tone ?? 'normal')}`}
                                                >
                                                    {l.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* title */}
                                    <div className="text-xs font-medium truncate">{arg.event.title}</div>

                                    {/* assignees */}
                                    {assignees && assignees.length > 0 && (
                                        <div className="flex -space-x-2 mt-1">
                                            {assignees.map((a) => (
                                                <Avatar key={a.id} className="w-5 h-5 border border-white">
                                                    {a.avatarUrl ? (
                                                        <AvatarImage src={a.avatarUrl} alt={a.name} />
                                                    ) : (
                                                        <AvatarFallback className="text-[10px]">
                                                            {a.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardItem>
                        )
                    }}
                    dateClick={(info) => {
                        const now = Date.now()
                        if (lastClick.current && now - lastClick.current < 300) {
                            setAnchorEl(info.dayEl)

                            setStartDate(info.date)
                            setDueDate(info.date)

                            setPopoverOpen(true)
                        }
                        lastClick.current = now
                    }}
                />
            </Card>

            <CalendarCreateCard
                board={board}
                anchorEl={anchorEl}
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
                startDateProps={startDate}
                dueDateProps={dueDate}
            />
        </div>
    )
}
