import React, { useMemo } from 'react'

interface Props {
    coverImageUrl: string | null
}

export const BoardCoverImage = React.memo(function BoardCoverImage({ coverImageUrl }: Props) {
    const style = useMemo(() => {
        if (!coverImageUrl) {
            return { backgroundColor: '#f4f5f7' }
        }
        if (!coverImageUrl.startsWith('linear-gradient')) {
            return { backgroundImage: `url(${coverImageUrl})` }
        }

        return { background: coverImageUrl }
    }, [coverImageUrl])

    return (
        <div
            className="absolute inset-0 bg-cover bg-center z-0 h-full"
            style={style}
            role="presentation"
            aria-hidden="true"
        />
    )
})
