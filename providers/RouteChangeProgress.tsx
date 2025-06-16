'use client'
 
import { ProgressProvider } from '@bprogress/next/app'
import type { ReactNode } from 'react'

export default function RouteChangeProgress({ children }: { children: ReactNode }) {
    return (
        <ProgressProvider 
            height="3px"
            color="#22d3ee"
            options={{ showSpinner: false }}
            shallowRouting
        >
            {children}
        </ProgressProvider>
    )
}