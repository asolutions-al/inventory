import { getFromHeaders } from "@/utils"

export const getSubscription = async () => {
  "use server"
  const { userId, shopId } = getFromHeaders()

  if (!shopId) return

  // const res = await db.query.subscription.findFirst({
  //   where: eq(subscription.shopId, shopId),
  // })

  return true
}
