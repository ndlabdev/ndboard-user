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
import { useRegisterMutation } from '@/features/auth'
import { useRouter } from '@bprogress/next/app'
import { toast } from 'sonner'
import { AuthLoginGoogleButton } from './AuthLoginGoogleButton'
import { AuthLoginGithubButton } from './AuthLoginGithubButton'

const registerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function AuthRegisterForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
    const router = useRouter()

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const registerMutation = useRegisterMutation(() => {
        toast.success('Register successful! Please login.')
        router.push('/login')
    }, (error) => {
        const msg =
            (error as { message?: string })?.message ||
            'Register failed. Please try again.'

        toast.error(msg)
    })

    const onSubmit = (values: RegisterFormValues) => {
        registerMutation.mutate(values)
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
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your information to register a new account
                    </p>
                </div>

                {/* Section: Fields */}
                <div className="grid gap-6">
                    { /* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Your name"
                                        autoComplete="name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                <FormLabel>Password</FormLabel>
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
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || registerMutation.isPending}>
                        {registerMutation.isPending ? (
                            <>
                                <Loader2Icon className="animate-spin" />
                                Registering...
                            </>
                        ) : 'Register'}
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
                    Already have an account?{' '}
                    <Link href="/login" className="underline underline-offset-4">
                        Login
                    </Link>
                </div>
            </form>
        </Form>
    )
}
