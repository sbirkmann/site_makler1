import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "makler_admin_session";

/**
 * Grober Schutz fuer den Verwaltungsbereich: ohne Session-Cookie geht es
 * direkt zum Login. Die eigentliche Signaturpruefung passiert serverseitig
 * in `getSession()` – die Middleware ersetzt sie nicht, sondern spart nur
 * den Umweg ueber das Rendern.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasCookie = request.cookies.has(COOKIE_NAME);
    if (!hasCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
