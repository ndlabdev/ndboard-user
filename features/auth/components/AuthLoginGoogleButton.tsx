'use client'

import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLoginGoogleMutation } from '@/features/auth'
import { toast } from 'sonner'

export function AuthLoginGoogleButton() {
    const loginGoogleMutation = useLoginGoogleMutation()

    const handleGoogleLogin = () => {
        loginGoogleMutation.mutate(undefined, {
            onSuccess: (res) => {
                if (res.data?.url) {
                    window.location.href = res.data.url
                } else {
                    toast.error('Google login URL not received.')
                }
            },
            onError: (error) => {
                const msg =
                    (error as { message?: string })?.message ||
                    'Login failed. Please try again.'

                toast.error(msg)
            }
        })
    }

    return (
        <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin} disabled={loginGoogleMutation.isPending}>
            {loginGoogleMutation.isPending ? (
                <>
                    <Loader2Icon className="animate-spin" />
                    Logging in...
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="mr-2 h-4 w-4">
                        <g>
                            <path
                                fill="#4285F4"
                                d="M24 9.5c3.54 0 6.4 1.52 7.87 2.78l5.81-5.81C34.17 3.36 29.62 1.5 24 1.5 14.82 1.5 6.81 7.97 3.62 16.14l6.97 5.41C12.28 15.08 17.67 9.5 24 9.5z"
                            />
                            <path
                                fill="#34A853"
                                d="M46.14 24.49c0-1.68-.15-3.29-.44-4.84H24v9.17h12.49c-.54 2.9-2.18 5.35-4.66 7.01l7.29 5.67c4.25-3.91 6.72-9.68 6.72-16.01z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.59 28.35A14.5 14.5 0 0 1 9.5 24c0-1.52.25-2.99.69-4.35l-6.97-5.41A23.95 23.95 0 0 0 0 24c0 3.8.91 7.4 2.51 10.58l8.08-6.23z"
                            />
                            <path
                                fill="#EA4335"
                                d="M24 46.5c6.43 0 11.82-2.13 15.76-5.82l-7.29-5.67c-2.03 1.37-4.61 2.18-8.47 2.18-6.33 0-11.72-5.58-13.41-12.92l-8.08 6.23C6.81 40.03 14.82 46.5 24 46.5z"
                            />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </g>
                    </svg>
                    Login with Google
                </>
            )}
        </Button>
    )
}
