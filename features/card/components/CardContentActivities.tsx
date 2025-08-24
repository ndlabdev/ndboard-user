import { memo } from 'react'
import { BoardCardsResponse } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { History } from 'lucide-react'

interface Props {
    card: BoardCardsResponse
}

export const CardContentActivities = memo(function CardContentActivities({
    card
}: Props) {
    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
                <History className="w-4 h-4" /> Activity
            </h4>

            <ul className="flex flex-col gap-3">
                {card.activities && card.activities.length > 0 ? (
                    card.activities.map((a) => (
                        <li key={a.id} className="flex gap-2 text-sm">
                            <Avatar className="w-6 h-6">
                                {a.user.avatarUrl ? (
                                    <AvatarImage src={a.user.avatarUrl} alt={a.user.name} />
                                ) : (
                                    <AvatarFallback>
                                        {a.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <span className="font-medium">{a.user.name}</span>{' '}
                                <span className="text-muted-foreground">{a.detail}</span>
                                <div className="text-xs text-muted-foreground">
                                    {format(new Date(a.createdAt), 'dd MMM yyyy HH:mm')}
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-muted-foreground italic">No activities yet</li>
                )}
            </ul>
        </div>
    )
})
