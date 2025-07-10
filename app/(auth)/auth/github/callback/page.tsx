'use client'

import { useEffect } from 'react'
import { useRouter } from '@bprogress/next/app'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useLoginGithubCallbackMutation } from '@/features/auth'

export default function GithubCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const { mutate, isPending, isError, error } = useLoginGithubCallbackMutation()

    useEffect(() => {
        if (code && state) {
            mutate({ code, state }, {
                onSuccess: (res) => {
                    toast.success('Login with Github successful!')
                    router.push(`/u/${res?.data?.user.username}/boards`)
                },
                onError: (err) => {
                    toast.error(
                        (err as { message?: string })?.message ||
                        'Github login failed! Please try again.'
                    )
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                }
            })
        } else {
            toast.error('Missing Github code!')
            router.push('/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, state])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-[#18181b] dark:to-zinc-900 px-4">
            <div className="bg-white/90 dark:bg-zinc-900/80 shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4 max-w-md w-full border border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`h-10 w-10 ${isPending ? 'animate-spin [animation-duration:2s]' : ''}`}>
                        <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            fill="currentColor"
                        />
                    </svg>

                    <h2 className="text-2xl font-semibold tracking-tight">
                        Github Authentication
                    </h2>
                </div>

                {/* Status Message */}
                <div className="text-base font-medium text-center text-slate-700 dark:text-slate-200 min-h-[28px]">
                    {isPending && (
                        <>
                            <span className="animate-pulse">Verifying Github, please wait...</span>
                        </>
                    )}
                    {isError && (
                        <>
                            <span className="text-destructive">
                                {(error as { message?: string })?.message || 'Login Github failed!'}
                            </span>
                        </>
                    )}
                    {!isPending && !isError && (
                        <span className="text-green-600 dark:text-green-400">
                            Successfully logged in! Redirecting...
                        </span>
                    )}
                </div>

                <div className="w-full h-2 mt-4 rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-green-400 animate-pulse" />

                {isError && (
                    <button
                        className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
                        onClick={() => router.push('/login')}
                    >
                        Go back to Login
                    </button>
                )}
            </div>
        </div>
    )
}
