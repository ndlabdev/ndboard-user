import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WorkspaceEditButton } from '@/features/workspace'

export function WorkspaceHeader({
    id,
    slug,
    name,
    description,
    imageUrl
}: {
    id: string
    slug: string
    name: string
    description?: string
    imageUrl?: string | null
}) {
    return (
        <div className="flex items-center gap-3 pt-4">
            <Avatar className="size-20 rounded-xl border bg-muted">
                {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
                <AvatarFallback>
                    {name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <h1 className="break-words font-semibold text-highlighted text-2xl">{name}</h1>
                    <WorkspaceEditButton
                        id={id}
                        slug={slug}
                        name={name}
                        description={description}
                    />
                </div>

                {description && (
                    <p className="text-base text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    )
}
