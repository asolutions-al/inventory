import { createServerClient } from "@supabase/ssr"
import { Session } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { getAuthUrl } from "./utils/supabase/auth"

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
  const crossDomainCookie = request.cookies.get("sb-auth")
  const { pathname, searchParams } = request.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  if (crossDomainCookie) {
    /**
     * TODO: check this, not sure if there is a better way to do this, but this is definitely not the best way
     */
    const session: Session = JSON.parse(crossDomainCookie!.value!)
    await supabase.auth.setSession(session)
  }

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
