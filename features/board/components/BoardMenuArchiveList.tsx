'use client'

import { memo, useEffect, useMemo, useState } from 'react'
import { Archive, RotateCcw, Trash } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { BoardDetailResponse } from '@/types'
import { useListGetArchiveListQuery, useListRestoreMutation } from '@/features/list'
import { useCardGetArchiveListQuery } from '@/features/card'

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

    const {
        data: listData,
        isLoading: isLoadingList
    } = useListGetArchiveListQuery(board.id, page, pageSize, debounced, isOpen && type === 'list')

    const {
        data: cardData,
        isLoading: isLoadingCard
    } = useCardGetArchiveListQuery(board.id, page, pageSize, debounced, isOpen && type === 'card')
    const restoreMutation = useListRestoreMutation(board.shortLink)

    const isLoading = type === 'list' ? isLoadingList : isLoadingCard
    const data = type === 'list' ? listData : cardData
    const hasMore = page < (data?.meta.totalPages ?? 0)

    const handleSwitchType = () => {
        setType((prev) => (prev === 'list' ? 'card' : 'list'))
        setSearch('')
        setDebounced('')
    }

    const archivedItems = useMemo(() => data?.data ?? [], [data])

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

                        <ul className="flex flex-col gap-2">
                            {isLoading && (
                                <span className="text-muted-foreground">Loading...</span>
                            )}

                            {!isLoading && archivedItems.length === 0 && (
                                <span className="text-muted-foreground">
                                    No archived {type}s found.
                                </span>
                            )}

                            {!isLoading &&
                                archivedItems.map((item, index) => {
                                    const isLast = index === archivedItems.length - 1
                                    
                                    return (
                                        <li key={item.id} className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span>{item.name}</span>
                                                <div className="flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="h-8"
                                                        disabled={restoreMutation.isPending}
                                                        onClick={() =>
                                                            restoreMutation.mutate({
                                                                id: item.id,
                                                                index: 0
                                                            })
                                                        }
                                                    >
                                                        <RotateCcw className="size-4" />
                                                        Restore
                                                    </Button>
                                                    <Button size="sm" variant="secondary" className="h-8">
                                                        <Trash className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {!isLast && <Separator />}
                                        </li>
                                    )
                                })}
                        </ul>

                        {hasMore && (
                            <div className="flex justify-center mt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPage((prev) => prev + 1)}
                                >
                                    Load more
                                </Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
