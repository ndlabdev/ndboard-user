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
    activities: {
        userId: string;
        id: string;
        createdAt: Date;
        cardId: string;
        detail: string | null;
        action: string;
    }[]
    customFields: {
        id: string
        name: string
        value: string
    }[]
    comments: {
        id: string;
        content: string;
        createdAt: Date;
        user: {
            name: string;
            id: string;
            email: string;
            avatarUrl: string | null;
        };
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
        startDate: Date | null;
        dueDate: Date | null;
        listId: string;
        labels: {
            name: string;
            id: string;
            boardId: string;
            color: string;
            tone: string;
        }[] | undefined;
        assignees: {
            id: string;
            name: string;
            avatarUrl: string | null;
        }[]
        comments: {
            id: string;
            content: string;
            createdAt: Date;
            user: {
                name: string;
                id: string;
                avatarUrl: string | null;
            };
        }[];
        activities: {
            id: string;
            action: string;
            detail: string | null;
            createdAt: Date;
            user: {
                name: string;
                id: string;
                avatarUrl: string | null;
            };
        }[];
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
        listId: string;
        activities: {
            userId: string;
            id: string;
            createdAt: Date;
            cardId: string;
            detail: string | null;
            action: string;
        }
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
        listId: string;
        activities: {
            userId: string;
            id: string;
            createdAt: Date;
            cardId: string;
            detail: string | null;
            action: string;
        }
    }
}

export interface CardDeleteChecklistItemResponse {
    data: {
        id: string
        cardId: string
        listId: string
        checklistId: string
        activities: {
            userId: string;
            id: string;
            createdAt: Date;
            cardId: string;
            detail: string | null;
            action: string;
        }
    }
}

export interface CardAddCommentResponse {
    data: {
        userId: string;
        id: string;
        createdAt: Date;
        cardId: string;
        content: string;
        activities: {
            user: {
                name: string;
                id: string;
                email: string;
                avatarUrl: string | null;
            };
        };
        user: {
            name: string;
            id: string;
            email: string;
            avatarUrl: string | null;
        };
    }
}
