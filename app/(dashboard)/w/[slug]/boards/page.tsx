'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceGetListQuery, WorkspaceHeader, WorkspaceSkeleton } from '@/features/workspace'

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
        <section className="flex flex-col gap-4">
            <WorkspaceHeader
                id={workspace.id}
                slug={workspace.slug}
                name={workspace.name}
                description={workspace.description}
                imageUrl={workspace.imageUrl}
            />

            <Separator />
        </section>
    )
}
