import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { useBoardFavoriteMutation, useBoardUnFavoriteMutation } from '@/features/board'
import { useQueryClient } from '@tanstack/react-query'
import { BoardDetailResponse } from '@/types'

interface Props {
    shortLink: string
    textColor: string
    isFavorite: boolean
}

export function BoardStar({
    shortLink,
    textColor,
    isFavorite
}: Props) {
    const queryClient = useQueryClient()
    const { mutate: favorite } = useBoardFavoriteMutation((_data, variables) => {
        queryClient.setQueryData(['boards', variables.shortLink], (old: BoardDetailResponse) => ({
            ...old,
            data: {
                ...old.data,
                isFavorite: true
            }
        }))
    })
    const { mutate: unFavorite } = useBoardUnFavoriteMutation((_data, variables) => {
        queryClient.setQueryData(['boards', variables.shortLink], (old: BoardDetailResponse) => ({
            ...old,
            data: {
                ...old.data,
                isFavorite: false
            }
        }))
    })

    const handleClick = () => {
        if (isFavorite) {
            unFavorite({ shortLink } )
        } else {
            favorite({ shortLink })
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="link"
                    className={`size-6 cursor-pointer text-white ${textColor === 'white' ? 'text-white' : 'text-black'}`}
                    onClick={handleClick}
                    tabIndex={0}
                    aria-label={isFavorite ? 'Unstar board' : 'Star board'}
                >
                    <Star
                        className="size-4"
                        fill={isFavorite ? '#facc15' : 'none'}
                        stroke={textColor === 'white' ? '#fff' : '#000'}
                        strokeWidth={isFavorite ? 0 : 2}
                    />
                </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">
                <p>{isFavorite ? 'Unstar this board' : 'Star this board'}</p>
                <p>Starred boards show up at the top of your boards list.</p>
            </TooltipContent>
        </Tooltip>
    )
}
