import { useQuery } from '@tanstack/react-query'
import { boardBoardCustomFieldListApi } from '@/lib/api'
import { BoardCustomFieldListResponse } from '@/types'

export function useBoardCustomFieldsQuery(shortLink: string) {
    return useQuery<BoardCustomFieldListResponse>({
        queryKey: ['boardCustomFields', shortLink],
        queryFn: () => boardBoardCustomFieldListApi(shortLink)
    })
}
