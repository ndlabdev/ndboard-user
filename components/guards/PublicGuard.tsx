'use client'

import { useRouter } from '@bprogress/next/app'
import { useEffect } from 'react'

export default function PublicGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const boardPath = localStorage.getItem('board_path')

    useEffect(() => {
        if (boardPath) {
            router.replace(boardPath)
        }
    }, [router, boardPath])

    return <>{children}</>
}
