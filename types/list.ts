import { BoardListsResponse } from './board'

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
    data: BoardListsResponse
}
