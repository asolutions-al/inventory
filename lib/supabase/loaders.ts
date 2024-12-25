import { db } from "@/db/(inv)/instance"
import { categories, member } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { and, eq } from "drizzle-orm"

export const getCategories = async () => {
  const { shopId } = getFromHeaders()
  const categoriesList = await db.query.categories.findMany({
    where: eq(categories.shopId, shopId),
  })
  return categoriesList
}

export const getMember = async () => {
  "use server"
  const { userId, shopId } = getFromHeaders()
  if (!userId || !shopId) return
  const memberRes = await db.query.member.findFirst({
    where: and(eq(member.userId, userId), eq(member.shopId, shopId)),
  })
  return memberRes
}
