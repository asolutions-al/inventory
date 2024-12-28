import { db } from "@/db/(inv)/instance"
import { category, member } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { and, eq } from "drizzle-orm"

export const getCategories = async () => {
  const { shopId } = await getFromHeaders()
  const categoriesList = await db.query.category.findMany({
    where: eq(category.shopId, shopId),
  })
  return categoriesList
}

export const getMember = async () => {
  "use server"
  const { userId, shopId } = await getFromHeaders()
  if (!userId || !shopId) return
  const memberRes = await db.query.member.findFirst({
    where: and(eq(member.userId, userId), eq(member.shopId, shopId)),
  })
  return memberRes
}
