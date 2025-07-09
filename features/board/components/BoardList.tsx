import {
    Card,
    CardContent,
    CardDescription,
    CardTitle
} from '@/components/ui/card'

import { BoardSkeleton, useBoardGetListQuery } from '@/features/board'
import { useRouter } from '@bprogress/next/app'
import { User } from 'lucide-react'

interface Props {
    workspaceId: string
}

export function BoardList({ workspaceId }: Props) {
    const router = useRouter()
    const { data, isLoading } = useBoardGetListQuery(workspaceId)

    if (isLoading) return <BoardSkeleton />

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data.map((board) => (
                <Card
                    key={board.id}
                    className="py-0 rounded-2xl gap-0 cursor-pointer"
                    onClick={() => router.push(`/b/${board.shortLink}/${board.slug}`)}
                >
                    <div
                        className="h-28 w-full rounded-t-xl"
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
        </div>
    )
}
