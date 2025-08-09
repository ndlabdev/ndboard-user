'use client'

import React, { useState, useMemo } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { SquareCheckBig } from 'lucide-react'
import { cardAddChecklistsSchema, useCardAddChecklistsMutation } from '@/features/card'
import { BoardCardsResponse, BoardDetailResponse } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
    card: BoardCardsResponse
    board: BoardDetailResponse['data']
}

export function CardAddChecklist({
    board,
    card
}: Props) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('Checklist')
    const [error, setError] = useState<string | null>(null)

    const defaultOrder = useMemo(() => {
        return 0
    }, [])

    const { mutate, isPending } = useCardAddChecklistsMutation(
        () => {
            setTitle('Checklist')
            setError(null)
            setOpen(false)
        },
        (err) => {
            setError('Failed to add checklist. Please try again.')
            console.error(err)
        }
    )

    const handleSubmit = () => {
        const parsed = cardAddChecklistsSchema.safeParse({
            id: card.id,
            title,
            order: defaultOrder
        })

        if (!parsed.success) {
            const msg = parsed.error.issues[0]?.message ?? 'Invalid data'
            setError(msg)
            
            return
        }

        setError(null)
        mutate(parsed.data)
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                >
                    <SquareCheckBig />
                    Checklist
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align='start'
                className="p-4 max-h-[60vh] overflow-y-auto bg-white shadow-xl rounded-xl w-80"
            >
                <div className="flex flex-col gap-2">
                    <div className="text-sm text-center font-semibold">Add Checklist</div>

                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isPending}
                        />
                        {error && (
                            <p className="text-xs text-destructive">{error}</p>
                        )}
                    </div>

                    <div>
                        <Button
                            size="sm"
                            onClick={handleSubmit}
                            disabled={isPending || title.trim().length === 0}
                        >
                            {isPending ? 'Adding…' : 'Add'}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
