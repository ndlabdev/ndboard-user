import { memo } from 'react'
import { BoardCardsResponse } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'

interface Props {
    card: BoardCardsResponse
}

export const CardItemAssignees = memo(function CardItemAssignees({
    card
}: Props) {
    if (!card.assignees || card.assignees.length === 0) return null

    return (
        <div className="flex justify-end mt-2">
            <div className="flex -space-x-2">
                <TooltipProvider>
                    {card.assignees.slice(0, 3).map((m) => (
                        <Tooltip key={m.id}>
                            <TooltipTrigger asChild>
                                <Avatar
                                    key={m.id}
                                    title={m.name}
                                    className="w-6 h-6 border-2 border-white"
                                >
                                    {m.avatarUrl ? (
                                        <AvatarImage src={m.avatarUrl} alt={m.name} />
                                    ) : (
                                        <AvatarFallback>
                                            {m.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                {m.name}
                            </TooltipContent>
                        </Tooltip>
                    ))}

                    {card.assignees.length > 3 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="w-6 h-6 border-2 border-white bg-gray-300 text-[10px] font-semibold cursor-pointer">
                                    <AvatarFallback>
                                        +{card.assignees.length - 3}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                {card.assignees
                                    .slice(3)
                                    .map((m) => m.name)
                                    .join(', ')}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            </div>
        </div>
    )
})
