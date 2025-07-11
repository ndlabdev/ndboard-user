import { isUrl } from '@/lib/utils'
import { CardLinkPreview } from '@/features/card'
import { useSortable } from '@dnd-kit/sortable'
import { CardGetListItem } from '@/types'
import { CSS } from '@dnd-kit/utilities'

interface Props {
    card: CardGetListItem
}

export function CardItem({ card }: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition
    } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card
        }
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    return (
        <li
            key={card.id}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white rounded-lg shadow border border-white hover:border-primary transition group list-none cursor-pointer"
        >
            {isUrl(card.name)
                ? <CardLinkPreview meta={card.meta} />
                : (
                    <div className="p-3">
                        <h4 className="font-semibold text-sm">
                            {card.name}
                        </h4>
                    </div>
                )}
        </li>
    )
}
