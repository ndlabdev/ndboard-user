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
