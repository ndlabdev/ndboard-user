import { memo, useState } from 'react'
import { isUrl } from '@/lib/utils'
import { CardAddLabel, CardLinkPreview } from '@/features/card'
import { BoardCardsResponse, BoardDetailResponse } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EditableTextarea } from './CardEditableTextarea'
import { LABEL_COLORS } from '@/features/board'

interface Props {
    card: BoardCardsResponse
    board: BoardDetailResponse['data']
    nearLastItem?: boolean
}

export function getLabelClass(color: string, type: 'subtle' | 'normal' | 'bold' = 'normal') {
    const c = LABEL_COLORS.find((x) => x.name === color)
    
    return c ? c[type] : 'bg-gray-200 text-gray-900'
}

export const CardItem = memo(function CardItem({
    card,
    board,
    nearLastItem = false
}: Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className={`bg-white rounded-lg shadow border border-white hover:border-primary group list-none cursor-pointer ${nearLastItem ? 'mb-2' : ''}`}>
                    {isUrl(card.name) && card.meta
                        ? <CardLinkPreview meta={card.meta} />
                        : (
                            <div className="p-3">
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
                            <CardAddLabel
                                card={card}
                                board={board}
                            />
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
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
