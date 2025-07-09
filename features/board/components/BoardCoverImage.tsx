interface Props {
    coverImageUrl: string | null
}

export function BoardCoverImage({ coverImageUrl }: Props) {
    return (
        <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={
                !coverImageUrl?.startsWith('linear-gradient')
                    ? { backgroundImage: `url(${coverImageUrl})` }
                    : { background: coverImageUrl }
            }
        />
    )
}
