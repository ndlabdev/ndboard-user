'use client'

import { useEffect } from 'react'
import { useRouter } from '@bprogress/next/app'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useLoginGoogleCallbackMutation } from '@/features/auth'

export default function GoogleCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const { mutate, isPending, isError, error } = useLoginGoogleCallbackMutation()

    useEffect(() => {
        if (code && state) {
            mutate({ code, state }, {
                onSuccess: (res) => {
                    toast.success('Login with Google successful!')
                    router.push(`/u/${res?.data?.user.username}/boards`)
                },
                onError: (err) => {
                    toast.error(
                        (err as { message?: string })?.message ||
                        'Google login failed! Please try again.'
                    )
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                }
            })
        } else {
            toast.error('Missing Google code!')
            router.push('/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, state])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-[#18181b] dark:to-zinc-900 px-4">
            <div className="bg-white/90 dark:bg-zinc-900/80 shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4 max-w-md w-full border border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <svg
                        className={`h-10 w-10 ${isPending ? 'animate-spin [animation-duration:2s]' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                    >
                        <g>
                            <path fill="#4285F4" d="M24 9.5c3.54 0 6.4 1.52 7.87 2.78l5.81-5.81C34.17 3.36 29.62 1.5 24 1.5 14.82 1.5 6.81 7.97 3.62 16.14l6.97 5.41C12.28 15.08 17.67 9.5 24 9.5z" />
                            <path fill="#34A853" d="M46.14 24.49c0-1.68-.15-3.29-.44-4.84H24v9.17h12.49c-.54 2.9-2.18 5.35-4.66 7.01l7.29 5.67c4.25-3.91 6.72-9.68 6.72-16.01z" />
                            <path fill="#FBBC05" d="M10.59 28.35A14.5 14.5 0 0 1 9.5 24c0-1.52.25-2.99.69-4.35l-6.97-5.41A23.95 23.95 0 0 0 0 24c0 3.8.91 7.4 2.51 10.58l8.08-6.23z" />
                            <path fill="#EA4335" d="M24 46.5c6.43 0 11.82-2.13 15.76-5.82l-7.29-5.67c-2.03 1.37-4.61 2.18-8.47 2.18-6.33 0-11.72-5.58-13.41-12.92l-8.08 6.23C6.81 40.03 14.82 46.5 24 46.5z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </g>
                    </svg>

                    <h2 className="text-2xl font-semibold tracking-tight">
                        Google Authentication
                    </h2>
                </div>

                {/* Status Message */}
                <div className="text-base font-medium text-center text-slate-700 dark:text-slate-200 min-h-[28px]">
                    {isPending && (
                        <>
                            <span className="animate-pulse">Verifying Google, please wait...</span>
                        </>
                    )}
                    {isError && (
                        <>
                            <span className="text-destructive">
                                {(error as { message?: string })?.message || 'Login Google failed!'}
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
