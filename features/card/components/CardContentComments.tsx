import { memo, useState } from 'react'
import { BoardCardsResponse } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { useCardAddCommentMutation } from '@/features/card'
import { useAuth } from '@/features/auth'
import { cn } from '@/lib/utils'

interface Props {
    card: BoardCardsResponse
}

export const CardContentComments = memo(function CardContentComments({
    card
}: Props) {
    const { user } = useAuth()
    const [commentText, setCommentText] = useState('')
    const addCommentMutation = useCardAddCommentMutation(card.id)
       
    const handleAddComment = () => {
        if (!commentText.trim()) return
        addCommentMutation.mutate(
            { content: commentText },
            {
                onSuccess: () => {
                    setCommentText('')
                }
            }
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Comments
            </h4>

            {/* Form add comment */}
            <div className="flex flex-col gap-2">
                <Textarea
                    placeholder="Write a comment..."
                    className="min-h-[60px]"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button
                        size="sm"
                        disabled={addCommentMutation.isPending || !commentText.trim()}
                        onClick={handleAddComment}
                    >
                        {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                    </Button>
                </div>
            </div>

            {/* List comments */}
            <ul className="flex flex-col gap-3 mt-2">
                {card.comments && card.comments.length > 0 ? (
                    card.comments.map((c) => {
                        const isMe = c.user.id === user?.id

                        return (
                            <li
                                key={c.id}
                                className={`flex gap-2 ${isMe ? 'flex-row-reverse text-right' : 'flex-row'}`}
                            >
                                <Avatar className="w-8 h-8">
                                    {c.user.avatarUrl ? (
                                        <AvatarImage src={c.user.avatarUrl} alt={c.user.name} />
                                    ) : (
                                        <AvatarFallback>
                                            {c.user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div
                                    className={cn(
                                        'flex flex-col rounded-lg px-3 py-2 w-full bg-muted/30 text-foreground',
                                        isMe
                                            ? 'items-end'
                                            : 'items-start'
                                    )}
                                >
                                    <div className={`flex flex-wrap justify-between items-center w-full ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span className="text-sm font-medium truncate">{isMe ? 'You' : c.user.name}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                            {format(new Date(c.createdAt), 'dd MMM yyyy HH:mm')}
                                        </span>
                                    </div>
                                    <p className="text-sm mt-1">{c.content}</p>
                                </div>
                            </li>
                        )
                    })
                ) : (
                    <li className="text-sm text-muted-foreground italic">No comments yet</li>
                )}
            </ul>
        </div>
    )
})
