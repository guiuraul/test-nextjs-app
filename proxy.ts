import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response, userId } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const knownPaths = new Set(["/", "/dashboard", "/imports", "/portfolio-setup", "/sign-in", "/sign-up"]);

  const isPublicTemplate = pathname.startsWith("/templates/");

  if (knownPaths.has(pathname) || isPublicTemplate) {
    return response;
  }

  const redirectUrl = new URL(userId ? "/dashboard" : "/", request.url);
  const redirectResponse = NextResponse.redirect(redirectUrl);

  response.cookies.getAll().forEach((cookie) => {
    const { name, value, ...options } = cookie;
    redirectResponse.cookies.set(name, value, options);
  });

  return redirectResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|css|js|map|json|csv)$).*)",
  ],
};
