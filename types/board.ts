import { PaginateMeta } from './api-common'
import { OgObject } from './og-object'
import type { JSONContent } from '@tiptap/core'

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
        isFavorite: boolean
        isTemplate: boolean
        isArchived: boolean
        archivedAt: Date | null
        order: number
        memberCount: number
    }[]
    meta: PaginateMeta
}

export interface BoardListsResponse {
    name: string;
    id: string;
    boardId: string;
    color: string;
    order: number;
    isFold: boolean;
}

export interface BoardCardChecklists {
    id: string;
    title: string;
    isShow?: boolean;
    order: number;
    items: {
        name: string;
        id: string;
        order: number;
        checklistId: string;
        isChecked: boolean;
    }[];
}

export interface BoardCardsResponse {
    id: string;
    name: string;
    description: JSONContent | null;
    listId: string;
    boardId: string;
    order: number;
    dueDate: Date | null;
    isArchived: boolean;
    labels: BoardLabelResponse[];
    assignees: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    }[];
    checklists: BoardCardChecklists[];
    attachments: {
        name: string;
        id: string;
        createdAt: Date;
        cardId: string;
        url: string;
        uploadedById: string;
    }[];
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
    customFieldValues: {
        id: string;
        value: string;
        cardId: string;
        boardCustomFieldId: string;
    }[];
    meta: OgObject;
}

export interface BoardMembersResponse {
    userId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    role: string;
}

export interface BoardDetailResponse {
    data: {
        owner: {
            name: string
            id: string
        }
        workspace: {
            id: string
            name: string
        }
        name: string
        id: string
        createdAt: Date
        updatedAt: Date
        description: string | null
        shortLink: string
        slug: string
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
        lists: BoardListsResponse[]
        labels: BoardLabelResponse[]
        members: BoardMembersResponse[]
        isFavorite: boolean
    }
}

export interface BoardLabelResponse {
    id: string
    color: string
    name: string
    boardId: string
    tone: 'subtle' | 'normal' | 'bold'
}

export interface BoardCreateResponse {
    data: {
        name: string
        slug: string
        shortLink: string
        id: string
        createdAt: Date
        updatedAt: Date
        description: string | null
        workspaceId: string
        visibility: string
        coverImageUrl: string | null
        isTemplate: boolean
        isArchived: boolean
        archivedAt: Date | null
        order: number
        ownerId: string
        createdById: string
        updatedById: string
    }
}

export interface BoardCreateLabelsResponse {
    data: {
        name: string;
        id: string;
        boardId: string;
        color: string;
        tone: string;
    }
}

export type BoardUpdateLabelResponse = BoardCreateLabelsResponse

export interface BoardUpdateResponse {
    data: {
        name: string
        slug: string
        shortLink: string
        id: string
        createdAt: Date
        updatedAt: Date
        description: string | null
        workspaceId: string
        visibility: string
        coverImageUrl: string | null
        isTemplate: boolean
        isArchived: boolean
        archivedAt: Date | null
        order: number
        ownerId: string
        createdById: string
        updatedById: string
    }
}

export interface BoardFavoriteResponse {
    data: {
        workspaceId: string;
        boardId: string;
        shortLink: string;
        userId: string;
        isFavorite: true;
    }
}

export interface BoardInviteMembersResponse {
    data: {
        boardId: string
        invitedUsers: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
        }[]
        skippedUsers: { userId: string; reason: string }[]
        role: string
    }
}
