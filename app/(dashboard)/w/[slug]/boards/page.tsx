'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useWorkspaceGetListQuery } from '@/features/workspace'
import { useParams } from 'next/navigation'
import React from 'react'

function WorkspaceSkeleton() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3 pt-4">
                <div className="rounded-full bg-muted animate-pulse w-12 h-12" />
                <div className="flex flex-col gap-2">
                    <div className="w-48 h-6 rounded bg-muted animate-pulse" />
                    <div className="w-36 h-4 rounded bg-muted animate-pulse" />
                </div>
            </div>
        </section>
    )
}

function WorkspaceHeader({
    name,
    description,
    imageUrl
}: {
    name: string
    description?: string | null
    imageUrl?: string | null
}) {
    return (
        <div className="flex items-center gap-3 pt-4">
            <Avatar className="size-20 rounded-xl border bg-muted">
                {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
                <AvatarFallback>
                    {name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div>
                <h1 className="break-words font-semibold text-highlighted text-2xl">{name}</h1>

                {description && (
                    <p className="text-base text-muted-foreground mt-1">{description}</p>
                )}
            </div>
        </div>
    )
}

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
                name={workspace.name}
                description={workspace.description}
                imageUrl={workspace.imageUrl}
            />
        </section>
    )
}
