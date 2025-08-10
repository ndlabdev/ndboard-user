import { memo, useState } from 'react'
import { getLabelClass, isUrl } from '@/lib/utils'
import { CardAddChecklist, CardAddLabel, CardLinkPreview } from '@/features/card'
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

                                <CardAddChecklist
                                    card={card}
                                    setLists={setLists}
                                />
                            </div>
                        </div>

                        <div className="col-span-12">
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
