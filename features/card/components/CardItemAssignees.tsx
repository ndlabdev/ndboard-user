import { memo } from 'react'
import { BoardCardsResponse } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
    card: BoardCardsResponse
}

export const CardItemAssignees = memo(function CardItemAssignees({
    card
}: Props) {
    return (
        <>
            {card.assignees && card.assignees.length > 0 && (
                <div className="flex justify-end mt-2">
                    <div className="flex -space-x-2">
                        {card.assignees.slice(0, 3).map((m) => (
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
                        ))}

                        {card.assignees.length > 3 && (
                            <Avatar className="w-6 h-6 border-2 border-white bg-gray-300 text-[10px] font-semibold">
                                <AvatarFallback>
                                    +{card.assignees.length - 3}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </div>
            )}
        </>
    )
})
