import { useMutation } from '@tanstack/react-query'
import { boardInviteMembersApi } from '@/lib/api'
import type { BoardInviteMembersResponse } from '@/types'

export function useBoardInviteMembersMutation(
    shortLink: string,
    onSuccess?: (_data: BoardInviteMembersResponse) => void,
    onError?: (_error: unknown) => void
) {
    return useMutation({
        mutationFn: (body: { userIds: string[]; role?: string }) =>
            boardInviteMembersApi(shortLink, body),
        onSuccess,
        onError
    })
}
