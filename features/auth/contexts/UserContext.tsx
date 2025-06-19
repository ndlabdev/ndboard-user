'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useMeQuery } from '../hooks/useMeQuery'
import type { User } from '@/types/user'

type UserContextType = {
    user: User['data'] | null
    isLoading: boolean
    isError: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const { data, isLoading, isError } = useMeQuery()

    return (
        <UserContext.Provider
            value={{
                user: data?.data ?? null,
                isLoading,
                isError
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    const ctx = useContext(UserContext)

    if (!ctx) throw new Error('useUserContext must be used within UserProvider')

    return ctx
}
