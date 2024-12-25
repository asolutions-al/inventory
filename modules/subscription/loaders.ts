import { db } from "@/db/(inv)/instance"
import { subscription } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { eq } from "drizzle-orm"

export const getSubscription = async () => {
  "use server"
  const { userId, shopId } = getFromHeaders()

  if (!shopId) return

  const res = await db.query.subscription.findFirst({
    where: eq(subscription.shopId, shopId),
  })

  return res
}
