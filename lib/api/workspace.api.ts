import { WorkspaceCreateFormValues } from '@/features/workspace'
import { apiFetch } from '@/lib/fetcher'
import type { WorkspaceCreateResponse, WorkspaceListResponse } from '@/types'

export function workspaceGetListApi(): Promise<WorkspaceListResponse> {
    return apiFetch<WorkspaceListResponse>('/workspace', {
        query: {
            pageSize: 30
        }
    })
}

export function workspaceCreateApi(payload: WorkspaceCreateFormValues): Promise<WorkspaceCreateResponse> {
    return apiFetch<WorkspaceCreateResponse>('/workspace', {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}