import { useEffect, useMemo, useState } from 'react'
import { useCardGetListQuery, CardItem } from '@/features/card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CardGetListResponse } from '@/types'

interface Props {
    listId: string
}

export function CardItemKanban({ listId }: Props) {
    const { data: cards } = useCardGetListQuery(listId)
    const [columns, setColumns] = useState<CardGetListResponse['data']>([])
    const cardsIds = useMemo(() => columns.map((col) => col.id), [columns])

    useEffect(() => {
        if (cards?.data) {
            setColumns(cards.data)
        }
    }, [cards?.data])

    return (
        <SortableContext items={cardsIds} strategy={verticalListSortingStrategy}>
            <ul className="p-2 pb-0 space-y-2 overflow-y-auto h-full">
                {columns.map((card) => (
                    <CardItem
                        key={card.id}
                        card={card}
                    />
                ))}
            </ul>
        </SortableContext>
    )
}
