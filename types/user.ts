export interface User {
    data: {
        id: string
        avatarUrl: string
        name: string
        email: string
        username: string
        role: string
        provider: string
        createdAt: string
        isVerified: boolean
    }
}

export interface UserWorkspaceList {
    data: {
        id: string;
        name: string;
        slug: string;
        description: string;
        imageUrl: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
        memberCount: number;
        members: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
            role: string;
        }[];
        boards: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            visibility: string;
        }[];
    }[]
}
