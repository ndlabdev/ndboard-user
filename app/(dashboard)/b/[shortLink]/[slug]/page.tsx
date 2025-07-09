'use client'

import { useParams } from 'next/navigation'
import { BoardCoverImage, BoardDetailSkeleton, useBoardDetailQuery } from '@/features/board'

export default function BoardDetailPage() {
    const params = useParams()
    const { data, isError, isLoading } = useBoardDetailQuery(params.shortLink as string)

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
        <section className="relative min-h-[calc(100vh-52px)] w-full">
            <BoardCoverImage coverImageUrl={board?.coverImageUrl} />

            <div className="relative z-20 flex flex-col h-[calc(100vh-40px)] w-full">
                <div className="backdrop-blur-md bg-black/10 shadow-lg inline-block py-2.5 px-4">
                    <h1 className="font-semibold text-base">
                        {board?.name}
                    </h1>
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    ?
                </div>
            </div>
        </section>
    )
}
