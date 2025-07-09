import { apiFetch } from '@/lib/fetcher'
import type { BoardListResponse } from '@/types'

export function boardGetListApi(workspaceId: string): Promise<BoardListResponse> {
    return apiFetch<BoardListResponse>('/boards', {
        query: {
            workspaceId,
            pageSize: 30
        }
    })
}
