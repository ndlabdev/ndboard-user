'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import {
    useWorkspaceGetListQuery,
    useWorkspaceMemberListQuery,
    WorkspaceSkeleton,
    WorkspaceInviteMember
} from '@/features/workspace'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function BoardMembersPage() {
    const params = useParams()
    const { data, isLoading } = useWorkspaceGetListQuery()
    const workspace = data?.data.find((item) => item.slug === params.slug)

    const { data: dataMembers, isLoading: isMembersLoading } = useWorkspaceMemberListQuery(
        workspace?.id ?? '',
        '',
        !!workspace
    )

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
            <div className="flex items-center justify-between pt-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Workspace Members</h1>
                    <p className="text-base text-muted-foreground">
                        Workspace members can view and join all Workspace visible boards
                        and create new boards in the Workspace.
                    </p>
                </div>

                {/* Invite Member Component */}
                <WorkspaceInviteMember workspaceId={workspace.id} />
            </div>

            <Separator />

            {isMembersLoading ? (
                <div className="text-muted-foreground">Loading members...</div>
            ) : dataMembers?.data?.length ? (
                <div className="flex flex-col gap-3">
                    {dataMembers.data.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    {member.avatarUrl ? (
                                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                                    ) : (
                                        <AvatarFallback>
                                            {member.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {member.email}
                                    </div>
                                </div>
                            </div>
                            <Badge variant="secondary" className="uppercase">{member.role}</Badge>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-muted-foreground italic">
                    No members in this workspace yet.
                </div>
            )}
        </section>
    )
}
