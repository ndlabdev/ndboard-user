import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/forgot-password',
    '/auth',
    '/'
]

function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    )
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (isPublicRoute(pathname)) {
        return NextResponse.next()
    }

    const token = request.cookies.get('token')?.value

    if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('next', pathname)

        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
}
