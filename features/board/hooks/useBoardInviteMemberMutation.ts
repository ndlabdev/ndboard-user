import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardInviteMembersApi } from '@/lib/api'
import type { BoardInviteMembersResponse, BoardDetailResponse } from '@/types'
import { toast } from 'sonner'

export function useBoardInviteMembersMutation(shortLink: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: { userIds: string[]; role?: string }) =>
            boardInviteMembersApi(shortLink, body),

        onSuccess: (data: BoardInviteMembersResponse) => {
            queryClient.setQueryData<BoardDetailResponse>(['boards', shortLink], (old) => {
                if (!old) return old

                const invitedUsers = data.data.invitedUsers.map((user) => ({
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    role: data.data.role
                }))

                return {
                    ...old,
                    data: {
                        ...old.data,
                        members: [...old.data.members, ...invitedUsers]
                    }
                }
            })

            const invitedCount = data.data.invitedUsers.length
            const skippedCount = data.data.skippedUsers.length

            toast.success(
                `Invited ${invitedCount} member${invitedCount > 1 ? 's' : ''} successfully` +
                (skippedCount
                    ? ` (${skippedCount} skipped: already in board or not in workspace)`
                    : '')
            )
        },

        onError: () => {
            toast.error('Failed to invite members')
        }
    })
}
