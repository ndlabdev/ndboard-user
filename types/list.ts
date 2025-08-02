import { PaginateMeta } from './api-common'
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

export interface ListGetArchiveResponse {
    data: ListGetListItem[]
    meta: PaginateMeta
}

export interface ListCreateResponse {
    data: BoardListsResponse
}

export interface ListUpdateResponse {
    data: BoardListsResponse
}

export interface ListCopyResponse {
    data: BoardListsResponse & {
        cardIds: string[]
    }
}

export interface ListMoveResponse {
    data: BoardListsResponse
}
