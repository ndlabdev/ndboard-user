'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { BoardDetailResponse } from '@/types'
import { useCalendarViewBoardQuery } from '@/features/calendar'
import { Card } from '@/components/ui/card'
import { useCardUpdateMutation } from '@/features/card'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
    board: BoardDetailResponse['data']
}

export function CalendarView({ board }: Props) {
    const { data, isLoading, isError } = useCalendarViewBoardQuery(board.id)
    const { mutate } = useCardUpdateMutation()

    const [selectedList, setSelectedList] = useState<string | null>(null)
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
    const [selectedMember, setSelectedMember] = useState<string | null>(null)

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
        .map((c) => ({
            id: c.id,
            title: c.name,
            start: c.startDate ?? c.dueDate ?? undefined,
            end: c.dueDate ?? undefined,
            allDay: !c.startDate || (c.startDate === c.dueDate),
            extendedProps: {
                listId: c.listId,
                listName: c.listName
            }
        }))

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
                    eventClick={(info) => {
                        alert(
                            `Clicked card: ${info.event.title} (List: ${info.event.extendedProps['listName']})`
                        )
                    }}
                />
            </Card>
        </div>
    )
}
