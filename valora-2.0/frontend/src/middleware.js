import { NextResponse } from "next/server";
import { PROTECTED_ROUTES, AUTH_ROUTES } from "@/lib/routes";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const localSessionExpiry = Number(
        request.cookies.get("valora_local_session")?.value
    );
    const hasLocalSession = Number.isFinite(localSessionExpiry) &&
        localSessionExpiry > Date.now();
    const token = request.cookies.get("auth_token")?.value || hasLocalSession;
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    );
    const isAuthRoute = AUTH_ROUTES.some((route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Coincide con todas las rutas de páginas, excepto:
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (icono)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};