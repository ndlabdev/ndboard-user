'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@bprogress/next/app'
import { CheckCircle, XCircle, Loader2, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('Verifying your email...')
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [resending, setResending] = useState(false)
    const [resendMessage, setResendMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Verification token is missing.')
            
            return
        }

        async function verify() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    }
                )

                const data = await res.json()

                if (!res.ok) {
                    if (data.code === 'TOKEN_EXPIRED' && data.data?.email) {
                        setUserEmail(data.data.email)
                    }
                    throw new Error(data.message || 'Verification failed')
                }

                setStatus('success')
                setMessage('Your email has been successfully verified!')
            } catch (err: unknown) {
                setStatus('error')
                setMessage(err instanceof Error ? err.message : 'Something went wrong.')
            }
        }

        verify()
    }, [token])

    async function handleResend() {
        if (!userEmail) return

        try {
            setResending(true)
            setResendMessage(null)

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Resend failed')

            setResendMessage('Verification email has been resent. Please check your inbox.')
        } catch (err: unknown) {
            setResendMessage(err instanceof Error ? err.message : 'Failed to resend verification email.')
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
                {/* Loading */}
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {/* Success */}
                {status === 'success' && (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Email Verified</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Button onClick={() => router.push('/login')}>Go to Login</Button>
                    </>
                )}

                {/* Error */}
                {status === 'error' && (
                    <>
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">{message}</p>

                        {/* Resend option when token expired */}
                        {userEmail && (
                            <div className="space-y-3">
                                <Button onClick={handleResend} disabled={resending} className="w-full">
                                    {resending ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <RefreshCcw className="w-4 h-4 mr-2" />
                                    )}
                                    Resend Verification Email
                                </Button>
                                {resendMessage && <p className="text-sm text-green-500">{resendMessage}</p>}
                            </div>
                        )}

                        <Button variant="outline" onClick={() => router.push('/')} className="mt-4 w-full">
                            Back to Home
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
