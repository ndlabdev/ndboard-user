import { apiFetch } from '@/lib/fetcher'
import type { User, UserWorkspaceList } from '@/types'

export function getMeApi(): Promise<User> {
    return apiFetch<User>('/auth/me')
}

export function userWorkspaceListApi(): Promise<UserWorkspaceList> {
    return apiFetch<UserWorkspaceList>('/user/workspaces')
}
