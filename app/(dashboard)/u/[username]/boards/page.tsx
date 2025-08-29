'use client'

import { Separator } from '@/components/ui/separator'
import { BoardList } from '@/features/board'
import { useUserWorkspaceListQuery } from '@/features/user'
import { WorkspaceHeader } from '@/features/workspace'

export default function BoardPage() {
    const { data, isLoading } = useUserWorkspaceListQuery()

    if (isLoading) {
        return (
            <section className="p-6">
                <p className="text-muted-foreground">Loading your workspaces...</p>
            </section>
        )
    }

    const workspaces = data?.data ?? []
    
    return (
        <section className="flex flex-col gap-4 px-4 overflow-y-auto pb-4">
            <div className="mt-4">
                <h2 className="text-3xl font-bold mb-4">Your Workspaces</h2>

                <div className="space-y-6">
                    {workspaces.map((ws) => (
                        <div
                            key={ws.id}
                            className="flex flex-col gap-4 pb-4"
                        >
                            <WorkspaceHeader
                                id={ws.id}
                                slug={ws.slug}
                                name={ws.name}
                                description={ws.description}
                                imageUrl={ws.imageUrl}
                            />

                            <Separator />

                            <div className="space-y-6">
                                <BoardList
                                    title='Starred Boards'
                                    workspaceId={ws.id}
                                    isStarred
                                />
                                
                                <BoardList workspaceId={ws.id} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
