'use client'

import { useAuth } from '@/features/auth'
import { useRouter } from '@bprogress/next/app'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function PrivateGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`)
        }
    }, [isAuthenticated, isLoading, router, pathname])

    if (isLoading) return <>Loading...</>
    if (isAuthenticated) return <>{children}</>

    return null
}
