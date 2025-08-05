'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceGetListQuery, WorkspaceHeader, WorkspaceSkeleton } from '@/features/workspace'
import { BoardList } from '@/features/board'

export default function BoardPage() {
    const params = useParams()
    const { data, isLoading } = useWorkspaceGetListQuery()
    const workspace = data?.data.find((item) => item.slug === params.slug)

    if (isLoading) return <WorkspaceSkeleton />

    if (!workspace) {
        return (
            <div className="p-8 text-center text-destructive">
                Workspace not found!
            </div>
        )
    }

    return (
        <section className="flex flex-col gap-4 px-4 overflow-y-auto pb-4">
            <WorkspaceHeader
                id={workspace.id}
                slug={workspace.slug}
                name={workspace.name}
                description={workspace.description}
                imageUrl={workspace.imageUrl}
            />

            <Separator />

            <BoardList
                title='Starred Boards'
                workspaceId={workspace.id}
                isStarred
            />

            <BoardList workspaceId={workspace.id} />
        </section>
    )
}
