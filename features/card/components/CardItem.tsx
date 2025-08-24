import { memo, useState } from 'react'
import { getLabelClass, isUrl } from '@/lib/utils'
import { CardAddChecklist, CardAddLabel, CardAssignMember, CardChecklistSummary, CardContentActivities, CardContentComments, CardCustomFieldsSection, CardItemAssignees, CardItemCustomFields, CardItemDueDate, CardItemLabels, CardLinkPreview, CardSetDueDate, useCardDetailQuery } from '@/features/card'
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
import { Loader2 } from 'lucide-react'
import { CardDescription } from './CardDescription'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

    const { data: cardDetail, isLoading } = useCardDetailQuery(card.id, isOpen)
   
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className={`bg-white rounded-lg shadow border border-white hover:border-primary group list-none cursor-pointer ${nearLastItem ? 'mb-2' : ''}`}>
                    {isUrl(card.name) && card.meta
                        ? <CardLinkPreview meta={card.meta} />
                        : (
                            <div className="p-3">
                                <CardItemLabels card={card} />
                                <h4 className="font-semibold text-sm">{card.name}</h4>
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
                    {isLoading && (
                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                            <Loader2 className="animate-spin w-5 h-5 mr-2" />
                            Loading card detail...
                        </div>
                    )}

                    {!isLoading && cardDetail && (
                        <div className="grid grid-cols-12 gap-4">
                            <div className="lg:col-span-8 col-span-12">
                                <div className="grid grid-cols-12 gap-4 mt-1 mb-4 px-6">
                                    <div className="col-span-12">
                                        <EditableTextarea
                                            cardId={cardDetail.data.id}
                                            value={cardDetail.data.name}
                                            placeholder="Card title"
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <div className="flex flex-wrap gap-2">
                                            <CardAddLabel
                                                card={cardDetail.data}
                                                board={board}
                                            />

                                            <CardSetDueDate card={cardDetail.data} />

                                            <CardAssignMember
                                                card={cardDetail.data}
                                                board={board}
                                            />

                                            <CardAddChecklist
                                                card={cardDetail.data}
                                                setLists={setLists}
                                            />
                                        </div>
                                    </div>

                                    {((cardDetail.data.assignees && cardDetail.data.assignees.length > 0) || (cardDetail.data.labels && cardDetail.data.labels.length > 0)) && (
                                        <div className="col-span-12">
                                            <div className="flex flex-wrap gap-4">
                                                {cardDetail.data.assignees && cardDetail.data.assignees.length > 0 && (
                                                    <div className="flex flex-col gap-2">
                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                            Members
                                                        </h4>

                                                        <ul className="flex gap-2 items-center flex-wrap">
                                                            {cardDetail.data.assignees.map((m) => (
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

                                                {cardDetail.data.labels && cardDetail.data.labels.length > 0 && (
                                                    <div className="flex flex-col gap-2">
                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                            Labels
                                                        </h4>

                                                        <ul className="flex gap-1 items-center">
                                                            {cardDetail.data.labels.map((item) => (
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
                                        <CardDescription card={cardDetail.data} />
                                    </div>

                                    {lists?.length > 0 && (
                                        <div className="col-span-12">
                                            <CardChecklistSection
                                                card={cardDetail.data}
                                                lists={lists}
                                                setLists={setLists}
                                            />
                                        </div>
                                    )}

                                    {board.customFields && board.customFields.length > 0 && (
                                        <div className="col-span-12">
                                            <CardCustomFieldsSection
                                                board={board}
                                                card={cardDetail.data}
                                            />
                                        </div>    
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-4 col-span-12 border-l px-4 mb-3 flex flex-col gap-6">
                                <CardContentComments card={cardDetail.data} />
                                <CardContentActivities card={cardDetail.data} />
                            </div>
                        </div>
                    )}

                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
