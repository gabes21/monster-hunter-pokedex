import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabaseResponse, claims } = await updateSession(request);

  const isLoggedIn = !!claims?.sub;
  const isLoginPage = pathname === "/admin";
  const isMonsterAdminPage =
    pathname === "/admin/monster" || pathname.startsWith("/admin/");

  // Not logged in? Redirect protected pages to the login page.
  if (isMonsterAdminPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Already logged in? Skip the login page.
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/monster", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
