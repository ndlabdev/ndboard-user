import { memo } from 'react'
import { cn } from '@/lib/utils'
import { BoardCardsResponse } from '@/types'
import { addDays, format, isBefore, isToday, isWithinInterval } from 'date-fns'

interface Props {
    card: BoardCardsResponse
}

export const CardItemDueDate = memo(function CardItemDueDate({
    card
}: Props) {
    if (!(card.startDate || card.dueDate)) return null

    return (
        <div className="my-2">
            {(() => {
                const now = new Date()
                const start = card.startDate ? new Date(card.startDate) : null
                const due = card.dueDate ? new Date(card.dueDate) : null
        
                let statusClass = ''
                if (due) {
                    if (isBefore(due, now) && !isToday(due)) {
                        statusClass = 'bg-red-100 text-red-600 border-red-200'
                    } else if (
                        isWithinInterval(due, { start: now, end: addDays(now, 1) })
                    ) {
                        statusClass = 'bg-amber-100 text-amber-600 border-amber-200'
                    } else {
                        statusClass = 'bg-green-100 text-green-600 border-green-200'
                    }
                }
        
                return (
                    <div
                        className={cn(
                            'inline-flex items-center text-sm font-medium px-2 py-1 rounded border',
                            statusClass
                        )}
                    >
                        {start
                            ? `${format(start, 'dd MMM yyyy')} → ${due ? format(due, 'dd MMM yyyy') : ''}`
                            : due
                                ? format(due, 'dd MMM yyyy')
                                : ''}
                    </div>
                )
            })()}
        </div>
    )
})
