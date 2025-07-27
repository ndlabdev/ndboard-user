import { memo, useCallback } from 'react'
import { Star } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useBoardFavoriteMutation, useBoardUnFavoriteMutation } from '@/features/board'
import { BoardDetailResponse } from '@/types'

interface Props {
    board: BoardDetailResponse['data']
}

export const BoardMenuStar = memo(function BoardMenuStar({
    board
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

    return (
        <DropdownMenuItem onClick={handleClick}>
            <Star
                fill={iconFill}
                stroke={'#000'}
                strokeWidth={isFavorite ? 0 : 2}
                className="size-5"
            />
            {isFavorite ? 'Unstar' : 'Star'}
        </DropdownMenuItem>
    )
})
