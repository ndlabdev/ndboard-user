'use client'

import { useAuth } from '@/features/auth'
import { useRouter } from '@bprogress/next/app'
import { useEffect } from 'react'

export function PublicGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.username) {
            router.replace(`/u/${user.username}/boards`)
        }
    }, [isAuthenticated, isLoading, user, router])

    if (isLoading) return <div>Loading...</div>
    if (isAuthenticated) return null

    return <>{children}</>
}
