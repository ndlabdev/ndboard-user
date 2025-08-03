'use client'

import { memo, useMemo } from 'react'
import { RotateCcw, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCardGetArchiveListQuery, useCardRestoreMutation } from '@/features/card'
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
    page: number
    setPage: (_p: number) => void
    pageSize: number
    search: string
}

export const CardArchiveSection = memo(function CardArchiveSection({
    boardId,
    page,
    setPage,
    pageSize,
    search
}: Props) {
    const {
        data,
        isLoading
    } = useCardGetArchiveListQuery(boardId, page, pageSize, search, true)
    const restoreMutation = useCardRestoreMutation()

    const cards = useMemo(() => data?.data ?? [], [data])

    return (
        <>
            <ul className="flex flex-col gap-2">
                {isLoading && (
                    <span className="text-muted-foreground">Loading...</span>
                )}

                {!isLoading && cards.length === 0 && (
                    <span className="text-muted-foreground">
                        No archived cards found.
                    </span>
                )}

                {!isLoading && cards.map((item, idx) => (
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

                                <Button size="sm" variant="secondary" className="h-8">
                                    <Trash className="size-4" />
                                </Button>
                            </div>
                        </div>

                        {idx !== cards.length - 1 && <Separator />}
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
