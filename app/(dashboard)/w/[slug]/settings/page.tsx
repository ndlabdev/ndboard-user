'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import {
    useWorkspaceGetListQuery,
    WorkspaceHeader,
    WorkspaceSkeleton,
    WorkspaceTransferOwnershipDialog
} from '@/features/workspace'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Users, Trash2, Crown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function BoardSettingsPage() {
    const params = useParams()
    const { data, isLoading } = useWorkspaceGetListQuery()
    const workspace = data?.data.find((item) => item.slug === params.slug)
    const [openTransferDialog, setOpenTransferDialog] = useState(false)

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

            {/* Members */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users size={18} /> Members
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {workspace?.members?.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between rounded-lg border p-2"
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
                                            {member.role}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                        Change role
                                    </Button>
                                    <Button size="sm" variant="destructive">
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Danger zone */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <Separator />
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => setOpenTransferDialog(true)}
                        >
                            <Crown size={16} /> Transfer Ownership
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Delete Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transfer Ownership Dialog */}
            <WorkspaceTransferOwnershipDialog
                workspaceId={workspace.id}
                ownerId={workspace.ownerId}
                members={workspace.members}
                open={openTransferDialog}
                onOpenChange={setOpenTransferDialog}
            />
        </section>
    )
}
