"use server"

import { member, shop } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { db } from "../instance"
import { InsertFormShopType } from "../schema"

const createShop = async (values: InsertFormShopType) => {
  try {
    const { userId } = await getFromHeaders()

    await db.transaction(async (tx) => {
      const [shopRes] = await tx
        .insert(shop)
        .values({
          ...values,
          updatedBy: userId,
        })
        .returning({
          id: shop.id,
        })

      await tx.insert(member).values({
        updatedBy: userId,
        shopId: shopRes.id,
        role: "ADMIN",
        userId,
      })
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { createShop }
