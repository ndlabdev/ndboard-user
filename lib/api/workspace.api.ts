import { WorkspaceCreateFormValues, WorkspaceEditFormValues } from '@/features/workspace'
import { apiFetch } from '@/lib/fetcher'
import type { WorkspaceCreateResponse, WorkspaceListResponse, WorkspaceEditResponse } from '@/types'

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

export function workspaceEditApi(payload: WorkspaceEditFormValues): Promise<WorkspaceEditResponse> {
    return apiFetch<WorkspaceEditResponse>(`/workspace/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    })
}