'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
    useWorkspaceInviteMemberMutation,
    useWorkspaceMemberSearchQuery
} from '@/features/workspace'
import { WorkspaceMemberUser } from '@/types'

interface WorkspaceInviteMemberProps {
    workspaceId: string
}

export function useDebounce<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export function WorkspaceInviteMember({ workspaceId }: WorkspaceInviteMemberProps) {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 400)
    const [selectedUsers, setSelectedUsers] = useState<WorkspaceMemberUser[]>([])

    const { data, isLoading } = useWorkspaceMemberSearchQuery(workspaceId, debouncedSearch, !!debouncedSearch)
    const inviteMutation = useWorkspaceInviteMemberMutation(workspaceId)

    const handleToggleUser = (user: WorkspaceMemberUser) => {
        setSelectedUsers((prev) => {
            if (prev.find((u) => u.id === user.id)) {
                return prev.filter((u) => u.id !== user.id)
            }

            return [...prev, user]
        })
    }

    const handleRemoveUser = (id: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u.id !== id))
    }

    const handleInvite = () => {
        if (!selectedUsers.length) return
        inviteMutation.mutate({
            userIds: selectedUsers.map((u) => u.id)
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>Invite Member</Button>
            </PopoverTrigger>

            <PopoverContent className="w-[320px] p-4" align="end">
                <div className="flex flex-col gap-4">
                    {/* Selected user tags */}
                    <div className="flex flex-wrap gap-2">
                        {selectedUsers.map((user) => (
                            <Badge
                                key={user.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {user.name}
                                <button
                                    type="button"
                                    className="ml-1 rounded hover:bg-muted p-0.5"
                                    onClick={() => handleRemoveUser(user.id)}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>

                    {/* Input search */}
                    <Input
                        placeholder="Type a name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Search results */}
                    <ScrollArea className="max-h-60 border rounded-md">
                        {isLoading ? (
                            <div className="p-2 text-muted-foreground">Searching...</div>
                        ) : data?.data?.length ? (
                            <div className="flex flex-col gap-1">
                                {data.data.map((user) => {
                                    const isSelected = selectedUsers.some((u) => u.id === user.id)
                                    
                                    return (
                                        <button
                                            key={user.id}
                                            type="button"
                                            className={`flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-muted rounded-md ${
                                                isSelected ? 'bg-muted' : ''
                                            }`}
                                            onClick={() => handleToggleUser(user)}
                                        >
                                            <Avatar className="h-8 w-8">
                                                {user.avatarUrl ? (
                                                    <AvatarImage src={user.avatarUrl} />
                                                ) : (
                                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <span className="ml-auto text-primary font-semibold">✓</span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-2 text-muted-foreground text-center text-sm">No users found</div>
                        )}
                    </ScrollArea>

                    <Button
                        onClick={handleInvite}
                        disabled={!selectedUsers.length || inviteMutation.isPending}
                    >
                        {inviteMutation.isPending ? 'Inviting...' : 'Send Invite'}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
