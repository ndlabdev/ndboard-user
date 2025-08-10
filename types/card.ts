import { PaginateMeta } from './api-common'
import { BoardCardChecklists, BoardCardsResponse } from './board'
import { OgObject } from './og-object'

export interface CardGetListItem {
    id: string
    name: string
    description: string | null
    dueDate: Date | null
    listId: string
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
    checklists: BoardCardChecklists[];
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

export interface CardCreateResponse {
    data: BoardCardsResponse
}

export interface CardUpdateResponse {
    data: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
        updatedById: string;
        isArchived: boolean;
        order: number;
        boardId: string;
        dueDate: Date | null;
        listId: string;
        labels: {
            name: string;
            id: string;
            boardId: string;
            color: string;
            tone: string;
        }[] | undefined;
    }
}

export interface CardAddChecklistsResponse {
    data: {
        readonly id: string;
        readonly cardId: string;
        readonly title: string;
        readonly order: number;
        readonly createdAt: Date;
        readonly items: {
            name: string;
            id: string;
            order: number;
            checklistId: string;
            isChecked: boolean;
        }[];
    }
}

export interface CardAddChecklistItemResponse {
    data: {
        readonly id: string;
        cardId: string
        readonly checklistId: string;
        readonly name: string;
        readonly isChecked: boolean;
        readonly order: number;
        readonly completedBy: {
            userId: string;
            checklistItemId: string;
            completedAt: Date;
        }[];
    }
}

export interface CardDeleteChecklistItemResponse {
    data: {
        id: string
        cardId: string
        checklistId: string
    }
}
