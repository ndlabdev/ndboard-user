'use client'

import { BOARD_TYPE, BoardType, useBoardUpdateMutation } from '@/features/board'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Layout, Calendar, BarChart2, Table, ChevronDown } from 'lucide-react'

interface Props {
    shortLink: string
    workspaceId: string
    currentType: BoardType
    textColor?: string
}

const typeOptions: { value: BoardType; label: string; icon: React.ElementType }[] = [
    { value: BOARD_TYPE.BOARD, label: 'Board', icon: Layout },
    { value: BOARD_TYPE.DASHBOARD, label: 'Dashboard', icon: BarChart2 },
    { value: BOARD_TYPE.TIMELINE, label: 'Timeline', icon: Calendar },
    { value: BOARD_TYPE.TABLE, label: 'Table', icon: Table },
    { value: BOARD_TYPE.CALENDAR, label: 'Calendar', icon: Calendar }
]

export function BoardTypeSelect({ shortLink, workspaceId, currentType, textColor }: Props) {
    const { mutate } = useBoardUpdateMutation(workspaceId)

    const handleChangeType = (newType: BoardType) => {
        if (newType !== currentType) {
            mutate({
                shortLink,
                type: newType
            })
        }
    }

    const current = typeOptions.find((t) => t.value === currentType)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="link"
                    size="sm"
                    style={{ color: textColor }}
                    className="flex items-center gap-1 h-6"
                >
                    {current && <current.icon className="w-4 h-4" />}
                    {current ? current.label : 'Board'}
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {typeOptions.map((t) => (
                    <DropdownMenuItem key={t.value} onClick={() => handleChangeType(t.value)}>
                        <t.icon className="w-4 h-4 mr-2" />
                        {t.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
