// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAuthenticated(request: NextRequest): boolean {
    // Nesta fase, a verificação de AUTH REAL deve ler o cookie/sessão.
    // Se você estiver logado (o NextAuth define um cookie de sessão), retorne true.

    // **Simulação:** Assumindo que você está logado após o login bem-sucedido.
    // (Ajuste esta lógica quando a autenticação real estiver em vigor).
    const sessionCookie = request.cookies.get('authjs.session-token');
    return !!sessionCookie;
}

export function middleware(request: NextRequest) {
    const isLoginPage = request.nextUrl.pathname === '/';
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dash');
    const isLoggedIn = isAuthenticated(request);

    // 1. Se o usuário acessa '/' e está logado, redireciona para '/dash'
    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/dash', request.url));
    }

    // 2. Se o usuário tenta acessar '/dash' e NÃO está logado, redireciona para '/'
    if (isDashboardRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Roda o middleware na rota raiz e na rota dash.
    matcher: ['/', '/dash/:path*'],
};