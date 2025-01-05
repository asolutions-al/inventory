"use server"

import { getAuthUrl } from "@/utils/supabase/auth"
import { createAuthClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

const signOut = async () => {
  try {
    const client = await createAuthClient()
    await client.auth.signOut()

    redirect(getAuthUrl())
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { signOut }
