'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@bprogress/next/app'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('Verifying your email...')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Verification token is missing.')
            
            return
        }

        async function verify() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await res.json()

                if (!res.ok) {
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Email Verified</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Button onClick={() => router.push('/auth/login')}>Go to Login</Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
                    </>
                )}
            </div>
        </div>
    )
}
