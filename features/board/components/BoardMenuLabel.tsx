import { memo, useMemo, useState } from 'react'
import { BoardDetailResponse } from '@/types'
import {
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { BoardMenuLabelForm, LABEL_COLORS } from '@/features/board'
import { Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Props {
    board: BoardDetailResponse['data']
}

export function getLabelClass(color: string, type: 'subtle' | 'normal' | 'bold' = 'normal') {
    const c = LABEL_COLORS.find((x) => x.name === color)
    
    return c ? c[type] : 'bg-gray-200 text-gray-900'
}

export const BoardMenuLabel = memo(function BoardMenuLabel({
    board
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')

    const filteredLabels = useMemo(() => {
        if (!search.trim()) return board.labels
        const keyword = search.toLowerCase()
        
        return board.labels.filter(
            (l) => l.name.toLowerCase().includes(keyword)
        )
    }, [board.labels, search])

    return (
        <DropdownMenuSub open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
                <Tag className="size-5" />
                Labels
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
                <DropdownMenuSubContent className="p-4 max-h-[60vh] overflow-y-auto bg-white shadow-xl rounded-xl w-80">
                    <div>
                        <Input
                            placeholder="Search labels..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mb-2"
                        />

                        <div className="text-xs font-semibold my-2 text-gray-500">Labels</div>
                        <div className="flex flex-col gap-1">
                            {filteredLabels.map((item) => (
                                <div key={item.id}>
                                    <div className="flex gap-1 items-center">
                                        <span
                                            className={`
                                                h-7 leading-7 pl-2 w-full text-xs font-semibold rounded
                                                ${getLabelClass(item.color, item.tone) || 'bg-gray-300 text-gray-900'}
                                                transition-colors duration-150
                                            `}
                                        >
                                            {item.name}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <BoardMenuLabelForm board={board} />
                        </div>
                    </div>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
})
