import { apiFetch } from '@/lib/fetcher'
import type { User } from '@/types'

export function getMeApi(): Promise<User> {
    return apiFetch<User>('/auth/me')
}
