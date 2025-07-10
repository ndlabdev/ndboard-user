import { useMutation } from '@tanstack/react-query'
import { authLogoutApi } from '@/lib/api'

export function useAuthLogoutMutation(
    onSuccess?: () => void,
    onError?: (_error: unknown) => void
) {
    return useMutation({
        mutationFn: authLogoutApi,
        onSuccess,
        onError
    })
}