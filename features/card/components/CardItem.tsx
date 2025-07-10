import { isUrl } from '@/lib/utils'
import { useCardGetListQuery, CardLinkPreview } from '@/features/card'

interface Props {
    listId: string
}

export function CardItem({ listId }: Props) {
    const { data } = useCardGetListQuery(listId)

    return (
        <>
            {data?.data.map((card) => (
                <li key={card.id} className="bg-white rounded-lg shadow border border-white hover:border-primary transition group list-none cursor-pointer">
                    {isUrl(card.name) ? (
                        <CardLinkPreview meta={card.meta} />
                    ) : (
                        <div className="p-3">
                            <h4 className="font-semibold text-sm">
                                {card.name}
                            </h4>
                        </div>
                    )}
                </li>
            ))}
        </>
    )
}
