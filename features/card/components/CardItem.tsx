import { memo, useState } from 'react'
import { getLabelClass, isUrl } from '@/lib/utils'
import { CardAddChecklist, CardAddLabel, CardAssignMember, CardChecklistSummary, CardCustomFieldsSection, CardItemAssignees, CardItemCustomFields, CardItemDueDate, CardLinkPreview, CardSetDueDate, useCardAddCommentMutation } from '@/features/card'
import { BoardCardChecklists, BoardCardsResponse, BoardDetailResponse } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { EditableTextarea } from './CardEditableTextarea'
import { CardChecklistSection } from './CardChecklistSection'
import { History, MessageSquare } from 'lucide-react'
import { CardDescription } from './CardDescription'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface Props {
    card: BoardCardsResponse
    board: BoardDetailResponse['data']
    nearLastItem?: boolean
}

export const CardItem = memo(function CardItem({
    card,
    board,
    nearLastItem = false
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [lists, setLists] = useState<BoardCardChecklists[]>(card?.checklists ?? [])
    const [commentText, setCommentText] = useState('')

    const addCommentMutation = useCardAddCommentMutation(card.id, card.listId)
   
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className={`bg-white rounded-lg shadow border border-white hover:border-primary group list-none cursor-pointer ${nearLastItem ? 'mb-2' : ''}`}>
                    {isUrl(card.name) && card.meta
                        ? <CardLinkPreview meta={card.meta} />
                        : (
                            <div className="p-3">
                                {card.labels.length > 0 && (
                                    <ul className="flex flex-wrap gap-1 items-center mb-2">
                                        {card.labels.map((item) => (
                                            <li
                                                key={item.id}
                                                className={`
                                                    h-4 text-center px-1 min-w-12 max-w-full text-[10px] font-semibold rounded
                                                    ${getLabelClass(item.color, item.tone) || 'bg-gray-300 text-gray-900'}
                                                    transition-colors duration-150
                                                `}
                                            >
                                                {item.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <h4 className="font-semibold text-sm">
                                    {card.name}
                                </h4>

                                <CardChecklistSummary card={card} />
                                <CardItemDueDate card={card} />
                                <CardItemCustomFields
                                    card={card}
                                    board={board}
                                />
                                <CardItemAssignees card={card} />
                            </div>
                        )}
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-5/6 max-h-[95vh] flex flex-col overflow-x-auto">
                <DialogHeader className="py-4 border-b">
                    <DialogTitle>
                        Header
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="lg:col-span-8 col-span-12">
                            <div className="grid grid-cols-12 gap-4 mt-1 mb-4 px-6">
                                <div className="col-span-12">
                                    <EditableTextarea
                                        cardId={card.id}
                                        value={card.name}
                                        placeholder="Card title"
                                    />
                                </div>

                                <div className="col-span-12">
                                    <div className="flex flex-wrap gap-2">
                                        <CardAddLabel
                                            card={card}
                                            board={board}
                                        />

                                        <CardSetDueDate card={card} />

                                        <CardAssignMember
                                            card={card}
                                            board={board}
                                        />

                                        <CardAddChecklist
                                            card={card}
                                            setLists={setLists}
                                        />
                                    </div>
                                </div>

                                {((card.assignees && card.assignees.length > 0) || (card.labels && card.labels.length > 0)) && (
                                    <div className="col-span-12">
                                        <div className="flex flex-wrap gap-4">
                                            {card.assignees && card.assignees.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                        Members
                                                    </h4>

                                                    <ul className="flex gap-2 items-center flex-wrap">
                                                        {card.assignees.map((m) => (
                                                            <li key={m.id} className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    {m.avatarUrl ? (
                                                                        <AvatarImage src={m.avatarUrl} alt={m.name} />
                                                                    ) : (
                                                                        <AvatarFallback>
                                                                            {m.name?.charAt(0).toUpperCase()}
                                                                        </AvatarFallback>
                                                                    )}
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium">{m.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{m.email}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
  
                                            {card.labels && card.labels.length > 0 && (
                                                <div className="flex flex-col gap-2">
                                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                        Labels
                                                    </h4>

                                                    <ul className="flex gap-1 items-center">
                                                        {card.labels.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                className={`
                                                h-7 leading-7 text-center px-3 min-w-12 max-w-full text-xs font-semibold rounded
                                                ${getLabelClass(item.color, item.tone) || 'bg-gray-300 text-gray-900'}
                                                transition-colors duration-150
                                            `}
                                                            >
                                                                {item.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="col-span-12">
                                    <CardDescription card={card} />
                                </div>

                                {lists?.length > 0 && (
                                    <div className="col-span-12">
                                        <CardChecklistSection
                                            card={card}
                                            lists={lists}
                                            setLists={setLists}
                                        />
                                    </div>
                                )}

                                {board.customFields && board.customFields.length > 0 && (
                                    <div className="col-span-12">
                                        <CardCustomFieldsSection
                                            board={board}
                                            card={card}
                                        />
                                    </div>    
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-4 col-span-12 border-l px-4 mb-3 flex flex-col gap-6">
                            {/* Comments */}
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
                                        card.comments.map((c) => (
                                            <li key={c.id} className="flex gap-2">
                                                <Avatar className="w-8 h-8">
                                                    {c.user.avatarUrl ? (
                                                        <AvatarImage src={c.user.avatarUrl} alt={c.user.name} />
                                                    ) : (
                                                        <AvatarFallback>
                                                            {c.user.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div className="flex flex-col bg-muted/30 rounded-lg px-3 py-2 w-full">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">{c.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {format(new Date(c.createdAt), 'dd MMM yyyy HH:mm')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mt-1">{c.content}</p>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-muted-foreground italic">No comments yet</li>
                                    )}
                                </ul>
                            </div>

                            {/* Activities */}
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
                        </div>
                    </div>

                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
