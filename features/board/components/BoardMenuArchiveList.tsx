'use client'

import { memo, useEffect, useState } from 'react'
import { Archive } from 'lucide-react'
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
import { ListArchiveSection } from '@/features/list'
import { CardArchiveSection } from '@/features/card'

interface Props {
    board: BoardDetailResponse['data']
    textColor: string
}

type ArchiveType = 'list' | 'card'

export const BoardMenuArchiveList = memo(function BoardMenuArchiveList({
    board
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState<ArchiveType>('list')
    const [search, setSearch] = useState('')
    const [debounced, setDebounced] = useState(search)
    const [page, setPage] = useState(1)

    const pageSize = 10

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(search), 300)
        
        return () => clearTimeout(timer)
    }, [search])

    // Reset page when type or search changes
    useEffect(() => {
        setPage(1)
    }, [debounced, type])

    const handleSwitchType = () => {
        setType((prev) => (prev === 'list' ? 'card' : 'list'))
        setSearch('')
        setDebounced('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Archive className="size-5" />
                    Archived items
                </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md max-h-[95vh] flex flex-col">
                <DialogHeader className="py-4 border-b">
                    <DialogTitle>
                        Archived {type === 'list' ? 'Lists' : 'Cards'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                    <div className="grid gap-4 mt-1 mb-4 px-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder={`Search archived ${type}s...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-9"
                                onClick={handleSwitchType}
                            >
                                Switch to {type === 'list' ? 'Cards' : 'Lists'}
                            </Button>
                        </div>

                        {type === 'list' ? (
                            <ListArchiveSection
                                boardId={board.id}
                                boardShortLink={board.shortLink}
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                search={debounced}
                            />
                        ) : (
                            <CardArchiveSection
                                boardId={board.id}
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                search={debounced}
                            />
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
