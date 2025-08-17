import { memo, useState } from 'react'
import { getLabelClass, isUrl } from '@/lib/utils'
import { calcAllChecklistsProgress, CardAddChecklist, CardAddLabel, CardAssignMember, CardLinkPreview } from '@/features/card'
import { BoardCardChecklists, BoardCardsResponse, BoardDetailResponse } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EditableTextarea } from './CardEditableTextarea'
import { CardChecklistSection } from './CardChecklistSection'
import { SquareCheckBig } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CardDescription } from './CardDescription'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
    card: BoardCardsResponse
    board: BoardDetailResponse['data']
    nearLastItem?: boolean
}

function CardChecklistSummary({ card }: Pick<Props, 'card'>) {
    if (!card.checklists || card.checklists.length === 0) return null

    const totalItems = card.checklists.reduce((sum, cl) => sum + cl.items.length, 0)
    const completedItems = card.checklists.reduce(
        (sum, cl) => sum + cl.items.filter((it) => it.isChecked).length,
        0
    )

    if (!totalItems) return null

    const progress = calcAllChecklistsProgress(card.checklists)

    const isDone = progress === 100

    return (
        <Badge
            variant={isDone ? 'default' : 'secondary'}
            className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium mt-2"
        >
            <SquareCheckBig className={`size-3 ${isDone ? 'text-white' : 'text-muted-foreground'}`} />
            {completedItems}/{totalItems}
        </Badge>
    )
}

export const CardItem = memo(function CardItem({
    card,
    board,
    nearLastItem = false
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [lists, setLists] = useState<BoardCardChecklists[]>(card?.checklists ?? [])
    
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
                            </div>
                        )}
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-5/6 max-h-[95vh] flex flex-col">
                <DialogHeader className="py-4 border-b">
                    <DialogTitle>
                        Header
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                    <div className="grid gap-4 mt-1 mb-4 px-6">
                        <div className="col-span-12">
                            <EditableTextarea
                                cardId={card.id}
                                value={card.name}
                                placeholder="Card title"
                            />
                        </div>

                        <div className="col-span-12">
                            <div className="flex gap-2">
                                <CardAddLabel
                                    card={card}
                                    board={board}
                                />

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

                        {(card.assignees && card.assignees.length > 0) && (card.labels && card.labels.length > 0) && (
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
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
