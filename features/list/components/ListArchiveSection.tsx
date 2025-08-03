'use client'

import { memo, useMemo, useState } from 'react'
import { RotateCcw, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useListDeleteMutation, useListGetArchiveListQuery, useListRestoreMutation } from '@/features/list'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis
} from '@/components/ui/pagination'
import { getPaginationRange } from '@/lib/paginationRange'

interface Props {
    boardId: string
    boardShortLink: string
    page: number
    setPage: (_p: number) => void
    pageSize: number
    search: string
}

export const ListArchiveSection = memo(function ListArchiveSection({
    boardId,
    boardShortLink,
    page,
    setPage,
    pageSize,
    search
}: Props) {
    const {
        data,
        isLoading
    } = useListGetArchiveListQuery(boardId, page, pageSize, search, true)
    const restoreMutation = useListRestoreMutation(boardShortLink)
    
    const [selectedListId, setSelectedListId] = useState<string | null>(null)
    const deleteMutation = useListDeleteMutation()

    const lists = useMemo(() => data?.data ?? [], [data])

    return (
        <>
            <ul className="flex flex-col gap-2">
                {isLoading && (
                    <span className="text-muted-foreground">Loading...</span>
                )}

                {!isLoading && lists.length === 0 && (
                    <span className="text-center text-muted-foreground">
                        No archived lists found.
                    </span>
                )}

                {!isLoading && lists.map((item, idx) => (
                    <li key={item.id} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8"
                                    disabled={restoreMutation.isPending && restoreMutation.variables?.id === item.id}
                                    onClick={() =>
                                        restoreMutation.mutate({ id: item.id })
                                    }
                                >
                                    <RotateCcw className="size-4" />
                                    Restore
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-8"
                                            onClick={() => setSelectedListId(item.id)}
                                        >
                                            <Trash className="size-4" />
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete list</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. Are you sure you want to permanently delete this list?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    if (selectedListId) {
                                                        deleteMutation.mutate({ id: selectedListId })
                                                        setSelectedListId(null)
                                                    }
                                                }}
                                                disabled={deleteMutation.isPending}
                                            >
                                                Confirm
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>

                        {idx !== lists.length - 1 && <Separator />}
                    </li>
                ))}
            </ul>

            {data?.meta && data.data.length > 0 && data.meta.totalPages > 1 && (
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            {getPaginationRange(page, data.meta.totalPages).map((p, i) => (
                                <PaginationItem key={i} className="cursor-pointer">
                                    {p === '...' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            isActive={p === page}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    )
})
