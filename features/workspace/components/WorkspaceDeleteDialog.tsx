'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useWorkspaceDeleteMutation } from '@/features/workspace/hooks/useWorkspaceDeleteMutation'

interface Props {
    workspaceId: string
    workspaceName: string
    open: boolean
    onOpenChange: (_open: boolean) => void
    onDeleted?: () => void
}

export function WorkspaceDeleteDialog({ workspaceId, workspaceName, open, onOpenChange, onDeleted }: Props) {
    const [confirmText, setConfirmText] = useState('')
    const deleteMutation = useWorkspaceDeleteMutation(() => {
        onOpenChange(false)
        onDeleted?.()
    })

    const handleDelete = () => {
        deleteMutation.mutate(workspaceId)
    }

    const disabled = confirmText !== workspaceName || deleteMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="px-4">
                <DialogHeader className="px-0">
                    <DialogTitle>Delete Workspace</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    This action <strong>cannot be undone</strong>. 
                    To confirm, please type the workspace name: <span className="font-medium">{workspaceName}</span>
                </p>

                <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type workspace name to confirm"
                />

                <DialogFooter className="px-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={disabled}
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
