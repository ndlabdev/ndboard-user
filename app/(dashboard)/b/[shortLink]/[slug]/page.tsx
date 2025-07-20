'use client'

import { useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { BoardCoverImage, BoardDetailSkeleton, BoardNameEditable, BoardStar, useBoardUpdateMutation, useBoardWithCardsQuery } from '@/features/board'
import { ListColumnKanban } from '@/features/list'
import { getTextColorByBg } from '@/utils'

export default function BoardDetailPage() {
    const params = useParams()
    const {
        board,
        allCards,
        isLoading,
        isError,
        listCards,
        isDragReady
    } = useBoardWithCardsQuery(params.shortLink as string)
    const { mutate } = useBoardUpdateMutation()

    const textColor = useMemo(
        () => getTextColorByBg(board?.coverImageUrl),
        [board?.coverImageUrl]
    )

    const handleUpdateBoardName = useCallback(
        (newName: string) => {
            if (board) {
                mutate({
                    shortLink: board.shortLink,
                    name: newName
                })
            }
        },
        [mutate, board]
    )

    if (isLoading) {
        return <BoardDetailSkeleton />
    }

    if (isError || !board) {
        return (
            <div className="p-8 text-center text-destructive">
                Board not found!
            </div>
        )
    }

    return (
        <section className="relative w-full h-full">
            <BoardCoverImage coverImageUrl={board.coverImageUrl} />

            <div className="relative z-20 flex flex-col h-full w-full">
                <div className="inline-block py-2.5 px-4 backdrop-blur-md bg-black/10 shadow-lg">
                    <div className="flex justify-between">
                        <BoardNameEditable
                            name={board.name}
                            textColor={textColor}
                            onUpdate={handleUpdateBoardName}
                        />

                        <div>
                            <BoardStar
                                textColor={textColor}
                                shortLink={board.shortLink}
                                isFavorite={board.isFavorite}
                            />
                        </div>
                    </div>
                </div>

                <div className="h-full w-full overflow-x-auto overflow-y-hidden max-h-[calc(100vh-108px)]">
                    <ListColumnKanban
                        board={board}
                        allCards={allCards}
                        listCards={listCards}
                        isDragReady={isDragReady}
                    />
                </div>
            </div>
        </section>
    )
}
