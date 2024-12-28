import { db } from "@/db/(inv)/instance"
import { Role } from "@/db/(inv)/schema"
import { invitation, member, user as schUser, shop } from "@/orm/(inv)/schema"
import { getAuthUrl } from "@/utils/supabase/auth"
import { createAuthClient } from "@/utils/supabase/server"
import { and, eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const t = await getTranslations()
  const { origin, pathname } = requestUrl

  const invId = requestUrl.searchParams.get("invId")

  const authClient = await createAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  const userId = user?.id

  /**
   * If user is not present, redirect to authenticate page.
   * This should never happen, but just in case.
   * Possible reasons:
   * 1. User authentication was not successful
   * 2. Trying to access this page directly
   */
  if (!userId) return NextResponse.redirect(getAuthUrl())

  const shopMember = await db.query.member.findFirst({
    where: eq(member.userId, userId),
  })

  /**
   * User is already a member of a shop.
   * Also, NO invitation id is present.
   * Therefore, redirect, since there is nothing to do here.
   */
  if (shopMember && !invId) return NextResponse.redirect(`${origin}/shop`)

  let shopId: string | undefined
  let role: Role | undefined
  let redirectPath: string = "/shop"

  try {
    await db.transaction(async (tx) => {
      /**
       * 1. Create a user
       */
      const existingUser = await db.query.user.findFirst({
        where: eq(schUser.id, userId),
      })
      /**
       * Having an existing user means:
       * User creation process has been run at least once.
       * Therefore, We skip this process.
       */
      if (!existingUser) {
        await tx.insert(schUser).values({
          id: userId, // use same id as auth user
          email: user.email!, // TODO: are we sure email is always present?
          updatedBy: userId,
        })
      }

      /**
       * 2. Create a shop
       */
      /**
       * Having an invitation id means:
       * User is invited to a shop.
       * Therefore, we don't create a new shop
       * Instead, we add user as a member to that shop, using data from the invitation.
       */
      if (invId) {
        const data = await db.query.invitation.findFirst({
          where: eq(invitation.id, invId),
          with: {
            shop: true,
          },
        })

        if (!data) return (redirectPath = `/invitation/${invId}/not-found`)

        const existingMember = await db.query.member.findFirst({
          where: and(
            eq(member.userId, user.id),
            eq(member.shopId, data.fromShopId)
          ),
        })

        if (existingMember)
          return (redirectPath = `/invitation/${invId}/existing-member`)

        shopId = data.fromShopId
        role = data.role
      } else {
        const [resShop] = await tx
          .insert(shop)
          .values({
            name: t("My Shop"),
            description: t("My First Shop"),
            updatedBy: userId,
          })
          .returning({
            id: shop.id,
          })
        shopId = resShop.id
        role = "ADMIN"
      }

      /**
       * 3. Create a member
       */
      await tx.insert(member).values({
        userId,
        shopId,
        role,
        updatedBy: userId,
      })
    })
  } catch (error) {
    console.error("Error while creating user, shop, member", error)
    // TODO: where to redirect?
    return NextResponse.redirect(origin)
  }

  return NextResponse.redirect(`${origin}${redirectPath}`)
}
