import { PaginateMeta } from './api-common'

export interface WorkspaceListResponse {
    data: {
        id: string
        name: string
        slug: string
        description: string | null
        imageUrl: string | null
        role: string
        joinedAt: Date
        ownerId: string
        createdAt: Date
        updatedAt: Date
        memberCount: number
    }[]
    meta: PaginateMeta
}
