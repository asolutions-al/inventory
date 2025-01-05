import { Role } from "@/db/(inv)/schema"
import { getMember } from "@/lib/supabase"
import { PropsWithChildren } from "react"

export const RoleWrapper = async ({
  children,
  requiredRole,
}: PropsWithChildren<{
  requiredRole: Role
}>) => {
  const memberRes = await getMember()

  if (memberRes?.role !== requiredRole) return null

  return <>{children}</>
}
