import { WorkspaceCreateFormValues, WorkspaceEditFormValues, WorkspaceInviteMemberFormValues } from '@/features/workspace'
import { apiFetch } from '@/lib/fetcher'
import type { WorkspaceCreateResponse, WorkspaceListResponse, WorkspaceEditResponse, WorkspaceMemberListResponse, WorkspaceInviteMemberResponse, WorkspaceMemberSearchResponse } from '@/types'

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

export function workspaceMemberListApi(workspaceId: string, search: string): Promise<WorkspaceMemberListResponse> {
    return apiFetch<WorkspaceMemberListResponse>(`/workspace/${workspaceId}/members`, {
        query: {
            search,
            pageSize: 30
        }
    })
}

export function workspaceInviteMemberApi(workspaceId: string, payload: WorkspaceInviteMemberFormValues): Promise<WorkspaceInviteMemberResponse> {
    return apiFetch<WorkspaceInviteMemberResponse>(`/workspace/${workspaceId}/invite`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

export function workspaceMemberSearchApi(workspaceId: string, q: string): Promise<WorkspaceMemberSearchResponse> {
    return apiFetch<WorkspaceMemberSearchResponse>(`/workspace/${workspaceId}/search-user`, {
        query: {
            q,
            pageSize: 30
        }
    })
}
