'use client'

import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { BoardChangeVisibility, BoardCoverImage, BoardDetailSkeleton, BoardInviteMember, BoardMenu, BoardNameEditable, BoardStar, BoardTypeSelect, useBoardUpdateMutation, useBoardWithCardsQuery } from '@/features/board'
import { ListColumnKanban } from '@/features/list'
import { getTextColorByBg } from '@/utils'
import { DashboardView } from '@/features/dashboard'
import { CalendarView } from '@/features/calendar'

export default function BoardDetailPage() {
    const params = useParams()
    const {
        board,
        listCards,
        isLoading,
        isError
    } = useBoardWithCardsQuery(params.shortLink as string)
    const { mutate } = useBoardUpdateMutation(board?.workspaceId as string)

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

    const textColor = getTextColorByBg(board.coverImageUrl as string)

    return (
        <section className="relative h-full overflow-hidden">
            <BoardCoverImage coverImageUrl={board.coverImageUrl} />

            <div className="relative z-20 flex flex-col h-full">
                <div className="inline-block py-2.5 px-4 backdrop-blur-md bg-black/10 shadow-lg">
                    <div className="flex justify-between">
                        <div className="flex gap-4">
                            <BoardNameEditable
                                name={board.name}
                                textColor={textColor}
                                onUpdate={handleUpdateBoardName}
                            />

                            <BoardTypeSelect
                                shortLink={board.shortLink}
                                workspaceId={board.workspaceId}
                                currentType={board.type}
                                textColor={textColor}
                            />
                        </div>

                        <div className="flex gap-2">
                            <BoardStar
                                textColor={textColor}
                                shortLink={board.shortLink}
                                isFavorite={board.isFavorite}
                            />

                            <BoardChangeVisibility
                                board={board}
                                textColor={textColor}
                            />

                            <BoardInviteMember
                                board={board}
                                shortLink={board.shortLink}
                                workspaceId={board.workspaceId}
                                textColor={textColor}
                            />

                            <BoardMenu
                                board={board}
                                textColor={textColor}
                            />
                        </div>
                    </div>
                </div>

                <div className="h-full overflow-y-hidden max-h-[calc(100vh-108px)]">
                    {board.type === 'board' && (
                        <ListColumnKanban
                            board={board}
                            listCards={listCards}
                        />
                    )}

                    {board.type === 'dashboard' && (
                        <DashboardView board={board} />
                    )}

                    {board.type === 'calendar' && (
                        <CalendarView board={board} />
                    )}
                </div>
            </div>
        </section>
    )
}
