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

export interface BoardsDetailResponse {
    data: {
        readonly owner: {
            name: string
            id: string
        }
        readonly workspace: {
            readonly id: string
            readonly name: string
        }
        readonly name: string
        readonly id: string
        readonly createdAt: Date
        readonly updatedAt: Date
        readonly description: string | null
        readonly shortLink: string
        readonly slug: string
        readonly workspaceId: string
        readonly ownerId: string
        readonly createdById: string
        readonly updatedById: string
        readonly visibility: string
        readonly coverImageUrl: string | null
        readonly isTemplate: boolean
        readonly isArchived: boolean
        readonly archivedAt: Date | null
        readonly order: number
    }
}
