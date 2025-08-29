'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useWorkspaceTransferOwnerMutation } from '@/features/workspace'

interface Props {
    workspaceId: string
    ownerId: string
    members: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        role: string;
        joinedAt: Date;
    }[]
    open: boolean
    onOpenChange: (_open: boolean) => void
}

export function WorkspaceTransferOwnershipDialog({
    workspaceId,
    ownerId,
    members,
    open,
    onOpenChange
}: Props) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const transferMutation = useWorkspaceTransferOwnerMutation(() =>
        onOpenChange(false)
    )

    const handleConfirmTransfer = () => {
        if (!selectedUserId) return
        transferMutation.mutate({
            workspaceId,
            newOwnerId: selectedUserId
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Ownership</DialogTitle>
                </DialogHeader>

                <div className="px-2 space-y-2 max-h-64 overflow-y-auto">
                    {members
                        .filter((m) => m.id !== ownerId)
                        .map((member) => (
                            <div
                                key={member.id}
                                className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer ${
                                    selectedUserId === member.id
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                }`}
                                onClick={() => setSelectedUserId(member.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        {member.avatarUrl ? (
                                            <AvatarImage
                                                src={member.avatarUrl}
                                                alt={member.name}
                                            />
                                        ) : (
                                            <AvatarFallback>
                                                {member.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
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
                                {selectedUserId === member.id && (
                                    <span className="text-xs text-primary font-medium">
                                        Selected
                                    </span>
                                )}
                            </div>
                        ))}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmTransfer}
                        disabled={!selectedUserId || transferMutation.isPending}
                    >
                        {transferMutation.isPending
                            ? 'Transferring...'
                            : 'Confirm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
