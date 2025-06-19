'use client'

import Link from 'next/link'
import { Loader2Icon } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { useLoginMutation } from '@/features/auth'
import { useRouter } from '@bprogress/next/app'
import { AuthLoginGoogleButton } from './AuthLoginGoogleButton'
import { AuthLoginGithubButton } from './AuthLoginGithubButton'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormValues = z.infer<typeof loginSchema>

export function AuthLoginForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
    const router = useRouter()

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const loginMutation = useLoginMutation(
        (data) => {
            if (data.data?.token) {
                localStorage.setItem('token', data.data.token)
                router.push('/dashboard')
            }
        }
    )

    const onSubmit = (values: LoginFormValues) => {
        loginMutation.mutate(values)
    }

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-6', className)}
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                {/* Section: Heading */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>

                {/* Section: Fields */}
                <div className="grid gap-6">
                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="m@example.com"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center">
                                    <FormLabel>Password</FormLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="current-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit button */}
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || loginMutation.isPending}>
                        {loginMutation.isPending ? (
                            <>
                                <Loader2Icon className="animate-spin" />
                                Logging in...
                            </>
                        ) : 'Login'}
                    </Button>

                    {/* Divider */}
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                            Or continue with
                        </span>
                    </div>

                    {/* Login with GitHub */}
                    <AuthLoginGithubButton />

                    {/* Login with Google */}
                    <AuthLoginGoogleButton />
                </div>

                {/* Section: Footer */}
                <div className="text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </form>
        </Form>
    )
}
