import { db } from "@/db/(inv)/instance"
import { member } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { and, eq } from "drizzle-orm"

export const getMember = async () => {
  "use server"
  const { userId, shopId } = await getFromHeaders()
  if (!userId || !shopId) return
  const memberRes = await db.query.member.findFirst({
    where: and(eq(member.userId, userId), eq(member.shopId, shopId)),
  })
  return memberRes
}
