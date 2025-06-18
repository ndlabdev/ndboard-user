import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getMeApi } from '@/lib/api'
import type { User } from '@/types'

export function useMeQuery(): UseQueryResult<User, unknown> {
    return useQuery({
        queryKey: ['me'],
        queryFn: getMeApi
    })
}
