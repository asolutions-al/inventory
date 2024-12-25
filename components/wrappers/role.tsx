import { Role } from "@/db/(inv)/schema"
import { getMember } from "@/lib/supabase"

export const RoleWrapper = async ({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole: Role
}) => {
  const memberRes = await getMember()

  if (memberRes?.role !== requiredRole) return null

  return <>{children}</>
}
