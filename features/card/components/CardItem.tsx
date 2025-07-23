import { memo } from 'react'
import { isUrl } from '@/lib/utils'
import { CardLinkPreview } from '@/features/card'
import { BoardCardsResponse } from '@/types'

interface Props {
    card: BoardCardsResponse
    nearLastItem?: boolean
    index: number
}

export const CardItem = memo(function CardItem({
    card,
    nearLastItem = false,
    index = 0
}: Props) {
    return (
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
    )
})
