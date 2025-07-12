'use client'

import { useParams } from 'next/navigation'
import { BoardCoverImage, BoardDetailSkeleton, useBoardDetailQuery } from '@/features/board'
import { ListColumnKanban } from '@/features/list'
import { useEffect, useState } from 'react'

export default function BoardDetailPage() {
    const params = useParams()
    const [render, setRender] = useState<boolean>(false)
    const { data, isError, isLoading } = useBoardDetailQuery(params.shortLink as string)

    useEffect(() => {
        setRender(true)
    }, [])

    if (!render) return null

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
                <div className="backdrop-blur-md bg-black/10 shadow-lg inline-block py-2.5 px-4">
                    <h1 className="font-semibold text-base">
                        {board.name}
                    </h1>
                </div>


                <div className="h-full w-full overflow-x-auto overflow-y-hidden max-h-[calc(100vh-108px)]">
                    <ListColumnKanban board={board} />
                </div>
            </div>
        </section>
    )
}
