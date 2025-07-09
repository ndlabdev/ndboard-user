import React, { useMemo } from 'react'
import Image from 'next/image'
import { BoardBackground } from '@/types'
import { DEFAULT_BOARD_BACKGROUNDS } from '@/features/workspace'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

interface BoardBackgroundSelectorProps {
    value?: string;
    onChange?: (_bg?: string) => void;
}

export function WorkspaceBackgroundPicker({
    value,
    onChange
}: BoardBackgroundSelectorProps) {
    const selected = useMemo(() => {
        if (!value) return DEFAULT_BOARD_BACKGROUNDS[0]

        return (
            DEFAULT_BOARD_BACKGROUNDS.find(
                (bg) =>
                    bg.type === 'image'
                        ? bg.fullUrl === value
                        : bg.value === value
            ) || DEFAULT_BOARD_BACKGROUNDS[0]
        )
    }, [value])

    const images = useMemo(
        () => DEFAULT_BOARD_BACKGROUNDS.filter((b) => b.type === 'image'),
        []
    )
    const gradients = useMemo(
        () => DEFAULT_BOARD_BACKGROUNDS.filter((b) => b.type === 'gradient'),
        []
    )

    const handleSelect = (bg: BoardBackground) => {
        if (bg.type === 'image') {
            onChange?.(bg.fullUrl)
        } else {
            onChange?.(bg.value)
        }
    }

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <div
                    className="w-full h-40 rounded-xl shadow relative overflow-hidden transition-all group"
                    style={
                        selected.type === 'image'
                            ? {
                                backgroundImage: `url(${selected.fullUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }
                            : { background: selected.value }
                    }
                >
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    <button
                        className="absolute inset-0 cursor-pointer flex items-center justify-center hover:bg-transparent bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                        tabIndex={-1}
                        type="button"
                    >
                        <span className="bg-white/90 text-primary text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                            Change Background
                        </span>
                    </button>
                </div>
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                align="center"
                className="p-4 max-h-[60vh] overflow-y-auto bg-white shadow-xl rounded-xl z-50 w-full"
            >
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
                            />
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
