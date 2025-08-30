import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import RouteChangeProgress from '@/providers/RouteChangeProgress'
import { Toaster } from '@/components/ui/sonner'

const ibmSans = IBM_Plex_Sans({
    variable: '--font-ibm-sans',
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap'
})

const ibmMono = IBM_Plex_Mono({
    variable: '--font-ibm-mono',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap'
})

export const viewport: Viewport = {
    themeColor: '#3b82f6'
}

export const metadata: Metadata = {
    title: {
        default: 'Task Manager – Organize your work like Trello',
        template: '%s | Task Manager'
    },
    description: 'Collaborative task management tool with boards, lists, cards, real-time updates, and advanced features like workspace roles, activity logs, custom fields and more.',
    keywords: [
        'task management',
        'kanban board',
        'trello clone',
        'project management',
        'productivity',
        'workspace collaboration'
    ],
    authors: [{ name: 'ndlabdev', url: 'https://github.com/ndlabdev' }],
    creator: 'ndlabdev',
    publisher: 'Task Manager',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    openGraph: {
        title: 'Task Manager – Organize your work like Trello',
        description:
            'Collaborative task management app with boards, lists, cards, real-time updates, and more.',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        siteName: 'Task Manager',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Task Manager'
            }
        ],
        locale: 'en_US',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Task Manager – Organize your work like Trello',
        description:
            'Collaborative task management app with boards, lists, cards, real-time updates, and more.',
        images: ['/og-image.png'],
        creator: '@your_twitter'
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png'
    }
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${ibmSans.variable} ${ibmMono.variable} antialiased bg-background text-foreground font-sans`}
            >
                <ReactQueryProvider>
                    <RouteChangeProgress>
                        {children}
                        <Toaster richColors position='top-center' />
                    </RouteChangeProgress>
                </ReactQueryProvider>
            </body>
        </html>
    )
}
