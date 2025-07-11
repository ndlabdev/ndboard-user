export interface ListGetListItem {
    id: string
    name: string
    boardId: string
    order: number
    createdAt: Date
    updatedAt: Date
}

export interface ListGetListResponse {
    data: ListGetListItem[]
}

export interface ListCreateResponse {
    data: {
        readonly id: string
        readonly name: string
        readonly boardId: string
        readonly order: number
        readonly createdAt: Date
        readonly updatedAt: Date
    }
}
