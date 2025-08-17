import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardRemoveMemberApi } from '@/lib/api'
import { toast } from 'sonner'
import type { BoardDetailResponse } from '@/types'

export function useBoardRemoveMemberMutation(shortLink: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userId: string) => boardRemoveMemberApi(shortLink, userId),
        onSuccess: (_data, userId) => {
            queryClient.setQueryData<BoardDetailResponse>(['boards', shortLink], (old) => {
                if (!old) return old

                return {
                    ...old,
                    data: {
                        ...old.data,
                        members: old.data.members.filter((m) => m.userId !== userId)
                    }
                }
            })

            toast.success('Removed member successfully')
        },
        onError: () => {
            toast.error('Failed to remove member')
        }
    })
}
