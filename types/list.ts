export interface ListGetListResponse {
    data: {
        id: string
        name: string
        boardId: string
        order: number
        createdAt: Date
        updatedAt: Date
    }[]
}
