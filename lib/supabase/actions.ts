import { TransactionSchemaType } from "@/components/form"
import { db } from "@/db/(inv)/instance"
import {
  InsertCategoryFormType,
  InsertProductFormType,
  SelectProductType,
  SelectTransactionType,
} from "@/db/(inv)/schema"
import { category, movement, product, transaction } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const createProduct = async (values: InsertProductFormType) => {
  "use server"
  const { userId, shopId } = getFromHeaders()

  const [res] = await db
    .insert(product)
    .values({
      ...values,
      shopId,
      // userId,
      updatedBy: userId,
    })
    .returning({
      id: product.id,
    })

  revalidatePath("/[lang]/[shopId]/products")
  return res
}

export const createCategory = async (values: InsertCategoryFormType) => {
  "use server"
  const { shopId } = getFromHeaders()
  await db.insert(category).values({
    ...values,
    shopId,
  })
  revalidatePath("/[lang]/[shopId]/products/create") //TODO: can optimize this
}

export const deleteCategory = async (id: string) => {
  "use server"
  await db.delete(category).where(eq(category.id, id))
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
        // userId,
        updatedBy: userId,
        date: rest.date.toISOString(),
      })
      .returning({
        id: transaction.id,
      })

    await tx.insert(movement).values(
      movements.map((m) => {
        const product = productsList.find((p) => p.id === m.productId)! // since it was selected, it must exist
        return {
          // ...m,
          // userId,
          transactionId: resTrans.id,
          type,
          shopId,
          updatedBy: userId,
          productDetails: product,
          amount: m.amount,
          productId: m.productId,
        }
      })
    )
    movements.forEach(async (m) => {
      // TODO: takes too long, find a way to optimize
      await tx
        .update(product)
        .set({
          currentStock: sql`${product.currentStock} + ${
            m.amount * (type === "IN" ? 1 : -1)
          }`,
        })
        .where(eq(product.id, m.productId))
    })
  })
}
