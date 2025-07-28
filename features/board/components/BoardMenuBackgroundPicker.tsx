import { memo, useMemo, useState } from 'react'
import { BoardBackground, BoardDetailResponse } from '@/types'
import {
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { DEFAULT_BOARD_BACKGROUNDS, useBoardUpdateMutation } from '@/features/board'

interface Props {
    board: BoardDetailResponse['data']
}

export const BoardMenuBackgroundPicker = memo(function BoardMenuBackgroundPicker({
    board
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const { mutate: updateBackground, isPending } = useBoardUpdateMutation(board.workspaceId)

    const selected = useMemo(() => {
        if (!board.coverImageUrl) return DEFAULT_BOARD_BACKGROUNDS[0]

        return (
            DEFAULT_BOARD_BACKGROUNDS.find(
                (bg) =>
                    bg.type === 'image'
                        ? bg.fullUrl === board.coverImageUrl
                        : bg.value === board.coverImageUrl
            ) || DEFAULT_BOARD_BACKGROUNDS[0]
        )
    }, [board.coverImageUrl])

    const images = useMemo(
        () => DEFAULT_BOARD_BACKGROUNDS.filter((b) => b.type === 'image'),
        []
    )
    const gradients = useMemo(
        () => DEFAULT_BOARD_BACKGROUNDS.filter((b) => b.type === 'gradient'),
        []
    )

    const handleSelect = (bg: BoardBackground) => {
        if (isPending) return
        const value = bg.type === 'image' ? bg.fullUrl : bg.value
        updateBackground({
            shortLink: board.shortLink,
            coverImageUrl: value
        })
    }

    const style = useMemo(() => {
        if (!board.coverImageUrl) {
            return { backgroundColor: '#f4f5f7' }
        }
        if (!board.coverImageUrl.startsWith('linear-gradient')) {
            return { backgroundImage: `url(${board.coverImageUrl})` }
        }

        return { background: board.coverImageUrl }
    }, [board.coverImageUrl])

    return (
        <DropdownMenuSub open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
                <div
                    className="size-5 bg-cover bg-center rounded-sm"
                    style={style}
                    role="presentation"
                    aria-hidden="true"
                />
                Change Background
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
                <DropdownMenuSubContent className="p-4 max-h-[60vh] overflow-y-auto bg-white shadow-xl rounded-xl w-full">
                    <div>
                        <div className="text-sm font-semibold mb-2 text-gray-500">Images</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {images.map((bg) => (
                                <button
                                    key={bg.key}
                                    aria-label={bg.key}
                                    className={`rounded-lg h-18 bg-default hover:bg-default p-0 overflow-hidden transition-all focus:outline-none hover:scale-105 active:scale-95 ${selected.key === bg.key ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'ring-0'}`}
                                    style={{ aspectRatio: '4/3' }}
                                    onClick={() => handleSelect(bg)}
                                    type="button"
                                    disabled={isPending}
                                >
                                    <Image
                                        src={bg.thumbnailUrl}
                                        alt={bg.fullUrl}
                                        width={400}
                                        height={56}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gradients */}
                    <div className="mt-4">
                        <div className="text-sm font-semibold mb-2 text-gray-500">Gradients</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {gradients.map((bg) => (
                                <button
                                    key={bg.key}
                                    aria-label={bg.key}
                                    className={`rounded-lg h-18 transition-all focus:outline-none hover:scale-105 active:scale-95 ${selected.key === bg.key ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'ring-0'}`}
                                    style={{
                                        background: bg.value,
                                        aspectRatio: '4/3'
                                    }}
                                    onClick={() => handleSelect(bg)}
                                    type="button"
                                    disabled={isPending}
                                />
                            ))}
                        </div>
                    </div>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    )
})
