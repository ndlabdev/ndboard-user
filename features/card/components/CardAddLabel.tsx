'use client'

import React, { useState, useMemo } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Edit, Tag } from 'lucide-react'
import { useCardUpdateMutation } from '@/features/card'
import { BoardMenuLabelForm } from '@/features/board'
import { BoardCardsResponse, BoardDetailResponse } from '@/types'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { getLabelClass } from '@/lib/utils'

interface Props {
    card: BoardCardsResponse
    board: BoardDetailResponse['data']
}

export function CardAddLabel({
    board,
    card
}: Props) {
    const [search, setSearch] = useState<string>('')
    const [editingLabel, setEditingLabel] = useState<BoardDetailResponse['data']['labels'][number] | null>(null)

    const { mutate } = useCardUpdateMutation()

    const filteredLabels = useMemo(() => {
        if (!search.trim()) return board.labels
        const keyword = search.toLowerCase()
        
        return board.labels.filter(
            (l) => l.name.toLowerCase().includes(keyword)
        )
    }, [board.labels, search])

    const cardLabels = useMemo(() => {
        return card?.labels?.map((l) => l.id) || []
    }, [card])

    const toggleLabel = (labelId: string, checked: boolean | 'indeterminate') => {
        if (checked === 'indeterminate') return

        const newLabelIds = checked
            ? [...cardLabels, labelId]
            : cardLabels.filter((id) => id !== labelId)

        mutate({
            id: card.id,
            labels: newLabelIds
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                >
                    <Tag />
                    Labels
                </Button>
            </PopoverTrigger>

            <PopoverContent align='start' className="p-4 max-h-[60vh] overflow-y-auto bg-white shadow-xl rounded-xl w-80">
                <div>
                    <Input
                        placeholder="Search labels..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-2"
                    />

                    <div className="text-xs font-semibold my-2 text-gray-500">Labels</div>
                    <div className="flex flex-col gap-1">
                        {filteredLabels.map((item) => (
                            <div key={item.id}>
                                <div className="flex gap-1 items-center">
                                    <Checkbox
                                        checked={cardLabels.includes(item.id)}
                                        onCheckedChange={(checked) => toggleLabel(item.id, checked)}
                                        className="border-muted size-4"
                                    />
        
                                    <span
                                        className={`
                                                h-7 leading-7 pl-2 w-full text-xs font-semibold rounded
                                                ${getLabelClass(item.color, item.tone) || 'bg-gray-300 text-gray-900'}
                                                transition-colors duration-150
                                            `}
                                    >
                                        {item.name}
                                    </span>

                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-7 w-7 rounded-sm"
                                        onClick={() => setEditingLabel(item)}
                                    >
                                        <Edit className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <BoardMenuLabelForm board={board} />

                        {editingLabel && (
                            <BoardMenuLabelForm
                                board={board}
                                mode="edit"
                                card={card}
                                initialValues={editingLabel}
                                open={!!editingLabel}
                                setOpen={(val) => { if (!val) setEditingLabel(null) }}
                                onSave={() => setEditingLabel(null)}
                            />
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
