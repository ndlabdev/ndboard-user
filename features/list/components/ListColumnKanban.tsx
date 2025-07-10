import { CardItem } from '@/features/card'
import { useListGetListQuery } from '@/features/list'

interface Props {
    boardId: string
}

export function ListColumnKanban({ boardId }: Props) {
    const { data: columns } = useListGetListQuery(boardId)

    return (
        <ul className="flex gap-4 items-start overflow-x-auto px-4 py-6 h-full">
            {columns?.data?.map((column) => (
                <li key={column.id} className="list-none flex-shrink-0 w-72 bg-white/90 rounded-xl shadow-lg flex flex-col max-h-full">
                    <header className="cursor-pointer">
                        <div className="flex items-center justify-between px-4 py-3">
                            <h3>{column.name}</h3>
                        </div>
                    </header>

                    <ul className="flex-1 overflow-y-auto px-2 py-2 h-full space-y-2">
                        <CardItem listId={column.id} />
                    </ul>
                </li>
            ))}
        </ul>
    )
}
