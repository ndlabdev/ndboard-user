import { memo, useCallback } from 'react'
import { Star } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useBoardFavoriteMutation, useBoardUnFavoriteMutation } from '@/features/board'
import { BoardDetailResponse } from '@/types'

interface Props {
    board: BoardDetailResponse['data']
    textColor: string
}

export const BoardMenuStar = memo(function BoardMenuStar({
    board,
    textColor
}: Props) {
    const { isFavorite, shortLink } = board
    const { mutate: favorite } = useBoardFavoriteMutation()
    const { mutate: unFavorite } = useBoardUnFavoriteMutation()
    
    const handleClick = useCallback(() => {
        if (isFavorite) {
            unFavorite({ shortLink })
        } else {
            favorite({ shortLink })
        }
    }, [isFavorite, favorite, unFavorite, shortLink])

    const iconFill = isFavorite ? '#facc15' : 'none'
    const iconStroke = textColor === 'white' ? '#fff' : '#000'

    return (
        <DropdownMenuItem onClick={handleClick}>
            <Star
                fill={iconFill}
                stroke={iconStroke}
                strokeWidth={isFavorite ? 0 : 2}
            />
            {isFavorite ? 'Unstar' : 'Star'}
        </DropdownMenuItem>
    )
})
