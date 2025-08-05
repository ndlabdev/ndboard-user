import { memo, useState } from 'react'
import { isUrl } from '@/lib/utils'
import { CardLinkPreview } from '@/features/card'
import { BoardCardsResponse } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EditableTextarea } from './CardEditableTextarea'

interface Props {
    card: BoardCardsResponse
    nearLastItem?: boolean
}

export const CardItem = memo(function CardItem({
    card,
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
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
})
