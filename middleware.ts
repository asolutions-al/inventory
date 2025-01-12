import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { getAuthUrl } from "./utils/supabase/auth"

const isDev = process.env.NODE_ENV === "development"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { pathname, searchParams } = request.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              domain: isDev ? "localhost" : ".asolutions.al", // https://github.com/supabase/supabase/issues/473#issuecomment-2543434925
              ...options,
            })
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userId = user?.id
  const shopId = pathname.split("/")[1]

  shopId && response.headers.set("x-shopId", shopId)
  userId && response.headers.set("x-userId", userId)

  //// ROUTE PROTECTION
  const isAtProtectedRoutes = !["/auth", "/invitation"].some((route) =>
    pathname.startsWith(route)
  )
  if (!user && isAtProtectedRoutes) {
    // user tries to access a protected route
    response = NextResponse.redirect(getAuthUrl({ searchParams }))
  }

  return response
}
