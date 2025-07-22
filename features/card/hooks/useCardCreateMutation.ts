import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cardCreateApi } from '@/lib/api'
import type { CardCreateResponse } from '@/types'
import type { CardCreateFormValues } from '@/features/card'
import { toast } from 'sonner'

export function useCardCreateMutation(onSuccess?: (_data: CardCreateResponse) => void): UseMutationResult<CardCreateResponse, unknown, CardCreateFormValues, unknown> {
    return useMutation<CardCreateResponse, unknown, CardCreateFormValues>({
        mutationFn: cardCreateApi,
        onSuccess: (data) => {
            onSuccess?.(data)
        },
        onError: (error) => {
            const msg = (error as { message?: string })?.message || 'Create Card Failed'
            toast.error(msg)
        }
    })
}
