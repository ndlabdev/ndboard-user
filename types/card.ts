import { PaginateMeta } from './api-common'
import { OgObject } from './og-object'

export interface CardGetListItem {
    id: string
    name: string
    description: string | null
    dueDate: Date | null
    order: number
    isArchived: boolean
    createdAt: Date
    updatedAt: Date
    labels: {
        name: string
        id: string
        boardId: string
        color: string
    }[]
    assignees: {
        id: string
        name: string
        avatarUrl: string | null
    }[]
    checklistCount: number
    attachments: {
        name: string
        id: string
        createdAt: Date
        cardId: string
        url: string
        uploadedById: string
    }[]
    customFields: {
        id: string
        name: string
        value: string
    }[]
    meta: OgObject
}


export interface CardGetListResponse {
    data: CardGetListItem[]
    meta: PaginateMeta
}
