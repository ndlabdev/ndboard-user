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

export type WorkspaceEditResponse = WorkspaceCreateResponse

export interface WorkspaceListResponse {
    data: {
        id: string
        name: string
        slug: string
        description: string
        imageUrl: string | null
        role: string
        joinedAt: Date
        ownerId: string
        createdAt: Date
        updatedAt: Date
        memberCount: number
        members: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
            role: string;
            joinedAt: Date;
        }[]
    }[]
    meta: PaginateMeta
}


export interface WorkspaceMemberListResponse {
    data: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        role: string;
        joinedAt: Date;
        invitedBy: {
            id: string;
            name: string;
            email: string;
        } | null;
    }[]
    meta: PaginateMeta
}

export interface WorkspaceInviteMemberResponse {
    data: {
        readonly member: {
            readonly id: string;
            readonly name: string;
            readonly email: string;
            readonly role: string;
            readonly joinedAt: Date;
        };
    }
}

export interface WorkspaceMemberUser {
    name: string;
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    isVerified: boolean;
}

export interface WorkspaceMemberSearchResponse {
    data: WorkspaceMemberUser[]
    meta: PaginateMeta
}

export interface WorkspaceMemberRemoveResponse {
    data: {
        userId: string;
        role: string;
        workspaceId: string;
        joinedAt: Date;
        invitedById: string | null;
    }
}

export interface WorkspaceTransferOwnerResponse {
    data: {
        readonly workspaceId: string;
        readonly oldOwnerId: string;
        readonly newOwnerId: string;
        readonly newOwnerName: string;
    }
    message: string
}
