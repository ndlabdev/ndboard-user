'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type OgImage = { url: string, width?: number, height?: number }
type OgObject = {
    ogUrl?: string | null
    requestUrl?: string | null
    ogTitle?: string | null
    ogSiteName?: string | null
    ogDescription?: string | null
    twitterTitle?: string | null
    twitterDescription?: string | null
    ogImage?: OgImage[] | null
    favicon?: string | null
}

interface BoardLinkCardProps {
    meta: OgObject
}

function getDomain(url?: string | null) {
    if (!url) return ''
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return ''
    }
}

export function CardLinkPreview({ meta }: BoardLinkCardProps) {
    const url = meta.ogUrl || meta.requestUrl || '#'
    const domain = getDomain(url)
    const siteName = meta.ogSiteName || domain
    const title = meta.ogTitle || meta.twitterTitle || domain
    const description = meta.ogDescription || meta.twitterDescription

    return (
        <Card className="border-0 relative group rounded-md bg-muted/90 p-0 overflow-hidden" draggable={false}>
            <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none rounded-md"
                draggable={false}
            >
                {meta.ogImage?.[0]?.url && (
                    <div className="w-full max-h-44 overflow-hidden rounded-t-md">
                        <Image
                            src={meta.ogImage[0].url}
                            alt={title}
                            width={meta.ogImage[0].width || 400}
                            height={meta.ogImage[0].height || 180}
                            className="w-full object-cover"
                            loading="lazy"
                            unoptimized
                            draggable={false}
                        />
                    </div>
                )}

                <div className="flex items-center gap-2 mt-3 px-4">
                    {meta.favicon ? (
                        <Avatar className="w-4 h-4">
                            <AvatarImage src={meta.favicon} alt={siteName} width={16} height={16} />
                            <AvatarFallback>{siteName.slice(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <Avatar className="w-4 h-4">
                            <AvatarFallback>{siteName.slice(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    <span className="text-xs font-semibold truncate text-muted-foreground">{siteName}</span>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="px-4 mt-2 font-semibold text-sm text-primary line-clamp-2 cursor-pointer">
                                {title}
                            </div>
                        </TooltipTrigger>

                        <TooltipContent>
                            <span>{title}</span>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {(!!description) && (
                    <div className="px-4 text-xs text-muted-foreground mt-1 line-clamp-3">
                        {description}
                    </div>
                )}

                <div className="flex items-center gap-1 mt-3 px-4 pb-3">
                    {meta.favicon && (
                        <Avatar className="w-4 h-4">
                            <AvatarImage src={meta.favicon} alt={siteName} width={16} height={16} />
                            <AvatarFallback>{domain.slice(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    <span className="text-xs text-muted truncate">{domain}</span>
                </div>
            </Link>
        </Card>
    )
}
