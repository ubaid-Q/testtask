import { NextRequest, NextResponse } from 'next/server'


export function middleware(request: NextRequest, res: NextResponse) {
    const path = request.nextUrl.pathname;
    if (path.startsWith('/dashboard') && !request.cookies.get('Authorization')) {
        return NextResponse.redirect(new URL(`${request.nextUrl.origin}/login`))
    }

    if (['/login', '/register'].includes(path) && request.cookies.get('Authorization')) {
        return NextResponse.redirect(new URL(`${request.nextUrl.origin}/dashboard`))
    }

    if (path == '/') {
        return NextResponse.redirect(new URL(`${request.nextUrl.origin}/dashboard`))
    }
    if (path.startsWith('/logout')) {
        request.cookies.delete("Authorization")
        return NextResponse.rewrite(new URL(`${request.nextUrl.origin}/dashboard`))
    }

}