'use client'

import * as React from 'react'
import { Check, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover'
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem
} from '@/components/ui/command'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BOARD_ROLE, useBoardInviteMembersMutation, useBoardRemoveMemberMutation } from '@/features/board'
import { useWorkspaceMemberListQuery } from '@/features/workspace'
import { cn } from '@/lib/utils'
import { BoardDetailResponse } from '@/types'

function useDebounce<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = React.useState(value)
    React.useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay)
        
        return () => clearTimeout(handler)
    }, [value, delay])
    
    return debounced
}

interface Props {
    board: BoardDetailResponse['data']
    shortLink: string
    workspaceId: string
    textColor?: string
}

export function BoardInviteMember({
    board,
    shortLink,
    workspaceId,
    textColor
}: Props) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [selected, setSelected] = React.useState<string[]>([])
    const debouncedSearch = useDebounce(search, 300)

    const { data, isLoading } = useWorkspaceMemberListQuery(
        workspaceId,
        debouncedSearch,
        !!debouncedSearch
    )

    const { mutate: removeMember } = useBoardRemoveMemberMutation(shortLink)
    const { mutate, isPending } = useBoardInviteMembersMutation(shortLink)

    const toggleSelect = (userId: string) => {
        setSelected((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        )
    }

    const handleInviteAll = () => {
        if (selected.length === 0) return
        mutate({ userIds: selected })
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    variant="link"
                    className={'size-6 cursor-pointer'}
                    tabIndex={0}
                    aria-label="Menu"
                >
                    <UserPlus className={`size-4 ${textColor === 'white' ? 'text-white' : 'text-black'}`} />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0 overflow-y-auto max-h-80">
                <div className="p-3">
                    <div className="text-xs font-semibold text-gray-500 mb-2">Board Members</div>
                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                        {board?.members?.map((m) => (
                            <div key={m.userId} className="flex items-center justify-between gap-2 p-1 rounded hover:bg-muted">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        {m.avatarUrl ? (
                                            <AvatarImage src={m.avatarUrl} alt={m.name} />
                                        ) : (
                                            <AvatarFallback>{m.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        )}
                                    </Avatar>

                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{m.name}</span>
                                        <span className="text-xs text-muted-foreground">{m.email}</span>
                                    </div>
                                </div>

                                {m.role !== BOARD_ROLE.ADMIN && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-destructive"
                                        onClick={() => removeMember(m.userId)}
                                    >
                                        ✕
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t p-2">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search member by name or email..."
                            value={search}
                            onValueChange={setSearch}
                        />

                        <CommandList>
                            {isLoading && (
                                <div className="p-2 text-sm text-muted-foreground">
                                    Searching...
                                </div>
                            )}

                            {debouncedSearch && <CommandEmpty>No results found.</CommandEmpty>}

                            {data?.data?.map((user) => {
                                const isSelected = selected.includes(user.id)
                            
                                return (
                                    <CommandItem
                                        key={user.id}
                                        value={user.email}
                                        onClick={(e) => e.preventDefault()}
                                        onSelect={() => toggleSelect(user.id)}
                                        className={cn(
                                            'flex items-center gap-3 cursor-pointer',
                                            isSelected && 'bg-muted'
                                        )}
                                    >
                                        <Avatar className="h-8 w-8">
                                            {user.avatarUrl ? (
                                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            ) : (
                                                <AvatarFallback>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex flex-col items-start flex-1">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                                    </CommandItem>
                                )
                            })}
                        </CommandList>
                    </Command>

                    {selected.length > 0 && (
                        <div className="p-2 border-t flex justify-end">
                            <Button
                                size="sm"
                                onClick={handleInviteAll}
                                disabled={isPending}
                            >
                                Add {selected.length} member{selected.length > 1 ? 's' : ''}
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
