import { InvitationCard } from "@/components/card"
import { db } from "@/db/(inv)/instance"
import { invitation } from "@/orm/(inv)/schema"
import { createAuthClient } from "@/utils/supabase/server"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function InvitationIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const client = await createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  const { id } = await params
  const data = await db.query.invitation.findFirst({
    where: eq(invitation.id, id),
    with: {
      shop: true,
      // user: true,
      user_fromUserId: true,
    },
  })

  if (!data) return redirect(`/invitation/${id}/not-found`)

  const href = user
    ? `/auth/callback?invId=${id}` // callback route will handle the invitation
    : // unexistant path, this way the middleware will redirect to the login page
      `/blablabla?invId=${id}`

  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 max-w-4xl p-2 mx-auto">
        <InvitationCard data={data} href={href} />
      </div>
    </div>
  )
}
