import { PaginateMeta } from './api-common'

export type BoardBackground = {
    key: string
    type: 'image' | 'gradient'
    thumbnailUrl: string
    fullUrl: string
    value?: string
}

export interface BoardListResponse {
    data: {
        name: string
        slug: string
        shortLink: string
        id: string
        createdAt: Date
        updatedAt: Date
        description: string | null
        workspaceId: string
        ownerId: string
        createdById: string
        updatedById: string
        visibility: string
        coverImageUrl: string | null
        isTemplate: boolean
        isArchived: boolean
        archivedAt: Date | null
        order: number
        memberCount: number
    }[]
    meta: PaginateMeta
}
