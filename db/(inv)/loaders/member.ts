import { member } from "@/orm/(inv)/schema"
import { eq } from "drizzle-orm"
import { unstable_cacheTag } from "next/cache"
import { db } from "../instance"

const getMembers = async ({ userId }: { userId: string }) => {
  "use cache"
  const members = await db.query.member.findMany({
    where: eq(member.userId, userId),
    with: { shop: true, user_userId: true },
  })
  unstable_cacheTag("members")
  return members
}

export { getMembers }
