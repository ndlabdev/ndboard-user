import {
    Card,
    CardContent,
    CardDescription,
    CardTitle
} from '@/components/ui/card'

import { BoardCreateFirst, BoardSkeleton, useBoardGetListQuery } from '@/features/board'
import { useRouter } from '@bprogress/next/app'
import { Star, User } from 'lucide-react'

interface Props {
    title?: string
    workspaceId: string
    isStarred?: boolean
}

export function BoardList({
    title = 'Your Boards',
    workspaceId,
    isStarred = false
}: Props) {
    const router = useRouter()
    const { data, isLoading } = useBoardGetListQuery(workspaceId, isStarred)

    if (isLoading) return <BoardSkeleton />

    const boards = data?.data || []

    if (isStarred && boards.length === 0) return

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {boards.map((board) => (
                    <Card
                        key={board.id}
                        className="py-0 rounded-2xl gap-0 cursor-pointer"
                        onClick={() => router.push(`/b/${board.shortLink}/${board.slug}`)}
                    >
                        <div className="relative h-28 w-full rounded-t-xl overflow-hidden">
                            <div
                                className="absolute inset-0"
                                style={
                                    !board.coverImageUrl?.startsWith('linear-gradient')
                                        ? {
                                            backgroundImage: `url(${board.coverImageUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }
                                        : { background: board.coverImageUrl }
                                }
                            />

                            {board.isFavorite && (
                                <Star className="absolute top-2 right-2 size-5 text-yellow-400 drop-shadow" fill="currentColor" />
                            )}
                        </div>

                        <CardContent className="px-0">
                            <div className="p-4 flex flex-col gap-1">
                                <CardTitle>{board.name}</CardTitle>

                                {board.description && (
                                    <CardDescription className="text-xs text-secondary-foreground line-clamp-2">
                                        {board.description}
                                    </CardDescription>
                                )}

                                <div className="flex text-xs text-muted-foreground mt-1 gap-1">
                                    <User className="size-3.5" />
                                    {board.memberCount || 1} member(s)
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {!isStarred && (
                    <BoardCreateFirst workspaceId={workspaceId} />
                )}
            </div>
        </div>
    )
}
