import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const clientCreator = ({
  supabaseUrl,
  supabaseKey,
}: {
  supabaseUrl: string
  supabaseKey: string
}) => {
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Not necessary atm. everything is server side
 */
// export const createClient = () => {
//   return clientCreator({
//     supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   });
// };
export const createAuthClient = () => {
  return clientCreator({
    supabaseUrl: process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!,
  })
}
