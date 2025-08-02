import { memo, useEffect, useState } from 'react'
import { Archive, RotateCcw, Trash } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { BoardDetailResponse } from '@/types'
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
import { useListGetArchiveListQuery } from '@/features/list'

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(search)
        }, 300)

        return () => clearTimeout(timer)
    }, [search])

    const {
        data,
        isLoading
    } = useListGetArchiveListQuery(board.id, page, pageSize, debounced)

    const handleSwitchType = () => {
        setType((prev) => (prev === 'list' ? 'card' : 'list'))
        setPage(1)
        setSearch('')
        setDebounced('')
    }

    const hasMore = data?.meta.totalPages && page < data.meta.totalPages

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
                    <DialogTitle>Archived {type === 'list' ? 'Lists' : 'Cards'}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                    <div className="grid gap-4 mt-1 mb-4 px-6">
                        <div className="col-span-9">
                            <Input
                                placeholder={`Search archived ${type}s...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-span-3">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-9 w-full"
                                onClick={handleSwitchType}
                            >
                                Switch to {type === 'list' ? 'Cards' : 'Lists'}
                            </Button>
                        </div>

                        <div className="col-span-12">
                            <ul className="flex flex-col gap-2">
                                {isLoading && (
                                    <span className="text-muted-foreground">Loading...</span>
                                )}

                                {!isLoading && data?.data.length === 0 && (
                                    <span className="text-muted-foreground">No archived {type}s found.</span>
                                )}

                                {!isLoading &&
                                    type === 'list' &&
                                    data?.data.map((list) => (
                                        <li key={list.id} className="flex items-center justify-between">
                                            <span>{list.name}</span>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="secondary" className="h-8">
                                                    <RotateCcw className="size-4" />
                                                    Restore
                                                </Button>

                                                <Button size="sm" variant="secondary" className="h-8">
                                                    <Trash className="size-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}

                                <li>
                                    <Separator />
                                </li>
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
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
