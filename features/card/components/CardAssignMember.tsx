'use client'

import React, { useMemo, useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { useCardUpdateMutation } from '@/features/card'
import { BoardCardsResponse, BoardDetailResponse } from '@/types'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface Props {
    card: BoardCardsResponse
    board: BoardDetailResponse['data']
}

export function CardAssignMember({ board, card }: Props) {
    const [search, setSearch] = useState<string>('')

    const { mutate } = useCardUpdateMutation()

    const filteredMembers = useMemo(() => {
        if (!search.trim()) return board.members
        const keyword = search.toLowerCase()
        
        return board.members.filter(
            (m) =>
                m.name.toLowerCase().includes(keyword) ||
        m.email.toLowerCase().includes(keyword)
        )
    }, [board.members, search])

    const cardMembers = useMemo(() => {
        return card?.assignees?.map((m) => m.id) || []
    }, [card])

    const toggleMember = (userId: string, checked: boolean | 'indeterminate') => {
        if (checked === 'indeterminate') return
        const newMemberIds = checked
            ? [...cardMembers, userId]
            : cardMembers.filter((id) => id !== userId)

        mutate({
            id: card.id,
            assignees: newMemberIds
        })
    }

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                    <User className="mr-1 h-4 w-4" />
                    Members
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="p-4 max-h-[60vh] overflow-y-auto bg-white shadow-xl rounded-xl w-80"
            >
                <div>
                    <Input
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-2"
                    />

                    <div className="text-xs font-semibold my-2 text-gray-500">Members</div>
                    <div className="flex flex-col gap-1">
                        {filteredMembers.map((member) => (
                            <div key={member.userId} className="flex gap-1 items-center">
                                <Checkbox
                                    checked={cardMembers.includes(member.userId)}
                                    onCheckedChange={(checked) =>
                                        toggleMember(member.userId, checked)
                                    }
                                    className="border-muted size-4"
                                />

                                <Avatar className="h-7 w-7">
                                    {member.avatarUrl ? (
                                        <AvatarImage
                                            src={member.avatarUrl}
                                            alt={member.name}
                                        />
                                    ) : (
                                        <AvatarFallback>
                                            {member.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>

                                <div className="flex flex-col ml-2 flex-1">
                                    <span className="text-sm font-medium">
                                        {member.name}
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        {member.email}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
