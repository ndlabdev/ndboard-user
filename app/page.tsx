'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import BgTasks from '../public/bg-tasks.avif'
import Link from 'next/link'

export default function HomePage() {
    return (
        <main className="relative h-screen w-full">
            {/* Background */}
            <Image
                src={BgTasks}
                alt="Task manager background"
                fill
                priority
                className="object-cover"
            />

            {/* Overlay mờ để chữ dễ đọc */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content center */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                    Streamline Your Workflow
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl">
                    Manage tasks, collaborate seamlessly, and boost team productivity — all in one powerful platform.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        <Link href="/register">Signup</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}
