'use client'

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback,
    Dispatch,
    SetStateAction
} from 'react'
import { useRouter } from '@bprogress/next/app'
import {
    useMeQuery,
    useAuthLogoutMutation
} from '@/features/auth'
import type { User } from '@/types/user'
import { toast } from 'sonner'

type AuthContextType = {
    user: User['data'] | null
    setUser: Dispatch<SetStateAction<User['data'] | null>>
    isAuthenticated: boolean
    isLoading: boolean
    signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { data, isLoading, isFetching } = useMeQuery()
    const [user, setUser] = useState<User['data'] | null>(null)

    const authLogoutMutation = useAuthLogoutMutation(
        () => {
            setUser(null)
            router.replace('/login')
            toast.success('Logged out successfully')
        },
        () => {
            setUser(null)
            router.replace('/login')
            toast.error('Session expired, please login again!')
        }
    )

    useEffect(() => {
        if (!isLoading && !isFetching) {
            setUser(data?.data ?? null)
        }
    }, [isLoading, isFetching, data])

    const signOut = useCallback(() => {
        authLogoutMutation.mutate()
    }, [authLogoutMutation])

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated: !!user,
                isLoading: !isLoading && !isFetching,
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
