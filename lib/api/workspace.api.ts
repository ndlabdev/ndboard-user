import { apiFetch } from '@/lib/fetcher'
import type { WorkspaceListResponse } from '@/types'

export function workspaceGetListApi(): Promise<WorkspaceListResponse> {
    return apiFetch<WorkspaceListResponse>('/workspace', {
        query: {
            pageSize: 30
        }
    })
}