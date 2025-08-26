export interface CalendarViewBoardResponse {
    data: {
        id: string
        name: string
        startDate: string | null
        dueDate: string | null
        listId: string
        listName: string
        labels: {
            id: string;
            name: string;
            color: string;
        }[];
        assignees: {
            id: string;
            name: string;
            avatarUrl: string | null;
        }[];
    }[]
    meta: { total: number }
}
