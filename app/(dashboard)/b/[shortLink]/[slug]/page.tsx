'use client'

import { useParams } from 'next/navigation'
import { BoardCoverImage, BoardDetailSkeleton, BoardNameEditable, useBoardWithCardsQuery } from '@/features/board'
import { ListColumnKanban } from '@/features/list'

export default function BoardDetailPage() {
    const params = useParams()
    const { data, allCards, isLoading, isError, isCardsLoading, isCardsError } = useBoardWithCardsQuery(params.shortLink as string)

    if (isLoading) {
        return <BoardDetailSkeleton />
    }

    if (isError || !data?.data) {
        return (
            <div className="p-8 text-center text-destructive">
                Board not found!
            </div>
        )
    }

    const board = data.data

    return (
        <section className="relative w-full h-full">
            <BoardCoverImage coverImageUrl={board?.coverImageUrl} />

            <div className="relative z-20 flex flex-col h-full w-full">
                <BoardNameEditable
                    name={board.name}
                    coverImageUrl={board.coverImageUrl as string}
                />

                <div className="h-full w-full overflow-x-auto overflow-y-hidden max-h-[calc(100vh-108px)]">
                    {isCardsLoading ? (
                        <div className="flex gap-4 px-4 py-6">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-72 bg-muted/70 rounded-xl h-[400px] flex-shrink-0 animate-pulse"
                                >
                                    <div className="h-12 bg-muted rounded-t-xl mb-4" />
                                    <div className="space-y-2 px-4">
                                        {[1, 2, 3].map((j) => (
                                            <div key={j} className="h-10 bg-muted rounded-lg" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isCardsError ? (
                        <div className="p-8 text-center text-destructive">
                            Cards load failed!
                        </div>
                    ) : (
                        <ListColumnKanban
                            board={board}
                            allCards={allCards}
                        />
                    )}
                </div>
            </div>
        </section>
    )
}
