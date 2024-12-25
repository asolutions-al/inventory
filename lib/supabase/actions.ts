import { TransactionSchemaType } from "@/components/form"
import { db } from "@/db/(inv)/instance"
import {
  InsertCategoryFormType,
  InsertProductFormType,
  SelectProductType,
  SelectTransactionType,
} from "@/db/(inv)/schema"
import { categories, movement, products, transaction } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const createProduct = async (values: InsertProductFormType) => {
  "use server"
  const { userId, shopId } = getFromHeaders()

  const [res] = await db
    .insert(products)
    .values({
      ...values,
      shopId,
      userId,
    })
    .returning({
      id: products.id,
    })

  revalidatePath("/[lang]/[shopId]/products")
  return res
}

export const createCategory = async (values: InsertCategoryFormType) => {
  "use server"
  const { shopId } = getFromHeaders()
  await db.insert(categories).values({
    ...values,
    shopId,
  })
  revalidatePath("/[lang]/[shopId]/products/create") //TODO: can optimize this
}

export const deleteCategory = async (id: string) => {
  "use server"
  await db.delete(categories).where(eq(categories.id, id))
  revalidatePath("/[lang]/[shopId]/products/create")
}

export const createTransaction = async (
  values: TransactionSchemaType,
  {
    type,
    products: productsList,
  }: {
    type: SelectTransactionType["type"]
    products: SelectProductType[]
  }
) => {
  "use server"
  const { userId, shopId } = getFromHeaders()
  const { movements, ...rest } = values
  const amount = movements.reduce((acc, m) => acc + m.amount, 0)
  await db.transaction(async (tx) => {
    const [resTrans] = await tx
      .insert(transaction)
      .values({
        ...rest,
        shopId,
        type,
        amount,
        userId,
        date: rest.date.toISOString(),
      })
      .returning({
        id: transaction.id,
      })

    await tx.insert(movement).values(
      movements.map((m) => {
        const product = productsList.find((p) => p.id === m.productId)! // since it was selected, it must exist
        return {
          ...m,
          transactionId: resTrans.id,
          type,
          shopId,
          userId,
          productDetails: product,
        }
      })
    )
    movements.forEach(async (m) => {
      // TODO: takes too long, find a way to optimize
      await tx
        .update(products)
        .set({
          currentStock: sql`${products.currentStock} + ${
            m.amount * (type === "IN" ? 1 : -1)
          }`,
        })
        .where(eq(products.id, m.productId))
    })
  })
}
