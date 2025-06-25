'use client'

import { useAuth } from '@/features/auth'
import { useRouter } from '@bprogress/next/app'
import { useEffect } from 'react'

export function PrivateGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) return <div>Loading...</div>
    if (!isAuthenticated) return null

    return <>{children}</>
}
