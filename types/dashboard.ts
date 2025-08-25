export interface DashboardViewBoardResponse {
    data: {
        cardsByList: { listId: string; listName: string; count: number }[]
        cardsByMember: { userId: string; userName: string; count: number }[]
        cardsByLabel: { id: string; name: string; color: string; count: number }[]
        cardsByDueDate: { date: string; count: number }[]
    }
}
