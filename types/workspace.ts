import { PaginateMeta } from './api-common'

export interface WorkspaceCreateResponse {
    data: {
        name: string
        slug: string
        description: string | null
        id: string
        createdAt: Date
        updatedAt: Date
        ownerId: string
        members: {
            userId: string
            role: string
            joinedAt: Date
            invitedById: string | null
            workspaceId: string
        }[]
    }
}

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
