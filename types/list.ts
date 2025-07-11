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
