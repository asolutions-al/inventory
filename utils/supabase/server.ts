import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const isDev = process.env.NODE_ENV === "development"

const clientCreator = async ({
  supabaseUrl,
  supabaseKey,
}: {
  supabaseUrl: string
  supabaseKey: string
}) => {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              domain: isDev ? "localhost" : ".asolutions.al", // https://github.com/supabase/supabase/issues/473#issuecomment-2543434925
              ...options,
            })
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
 * Not necessary atm. only auth clined is needed on server
 */
// export const createClient = () => {
//   return clientCreator({
//     supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   });
// };
export const createAuthClient = async () =>
  clientCreator({
    supabaseUrl: process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!,
  })
