'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from '@bprogress/next/app'
import { useMeQuery, useAuthRefreshTokenMutation } from '@/features/auth'
import type { User } from '@/types/user'

type AuthContextType = {
    user: User['data'] | null
    isAuthenticated: boolean
    isLoading: boolean
    refresh: () => Promise<void>
    signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { data, isLoading, isError, refetch } = useMeQuery()
    const [user, setUser] = useState<User['data'] | null>(null)

    const refreshTokenMutation = useAuthRefreshTokenMutation(
        () => {
            refetch()
        },
        () => {
            signOut()
        }
    )

    useEffect(() => {
        if (isError && !refreshTokenMutation.isPending) {
            refreshTokenMutation.mutate()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError])

    useEffect(() => {
        if (data?.data) setUser(data.data)
    }, [data])

    const signOut = useCallback(() => {
        localStorage.removeItem('token')
        setUser(null)
        router.replace('/login')
    }, [router])

    const refresh = useCallback(async () => {
        return new Promise<void>((resolve, reject) => {
            refreshTokenMutation.mutate(undefined, {
                onSuccess: () => {
                    refetch()
                    resolve()
                },
                onError: () => {
                    signOut()
                    reject()
                }
            })
        })
    }, [refreshTokenMutation, refetch, signOut])

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading: isLoading || refreshTokenMutation.isPending,
                refresh,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)

    if (!ctx) throw new Error('useAuth must be used within AuthProvider')

    return ctx
}
