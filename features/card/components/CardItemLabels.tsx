import { memo } from 'react'
import { BoardCardsResponse } from '@/types'
import { getLabelClass } from '@/lib/utils'

interface Props {
    card: BoardCardsResponse
}

export const CardItemLabels = memo(function CardItemLabels({
    card
}: Props) {
    if (!card.labels || card.labels.length === 0) return null

    return (
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
    )
})
