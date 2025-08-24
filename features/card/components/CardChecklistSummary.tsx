import { memo } from 'react'
import { calcAllChecklistsProgress } from '@/features/card'
import { BoardCardsResponse } from '@/types'
import { SquareCheckBig } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Props {
    card: BoardCardsResponse
}

export const CardChecklistSummary = memo(function CardChecklistSummary({
    card
}: Props) {
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
})
