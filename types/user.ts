export interface User {
    data: {
        id: string
        avatar: string
        name: string
        email: string
        username: string
        role: string
        provider: string
        createdAt: string
        isVerified: boolean
    }
}
