import { db } from "@/db/(inv)/instance"
import { ProductSchemaT, TransactionSchemaT } from "@/db/(inv)/schema"
import { movement, product, transaction } from "@/orm/(inv)/schema"
import { ProductFormSchemaT } from "@/providers/product-form"
import { TransactionFormSchemaT } from "@/providers/transaction-form"
import { getFromHeaders } from "@/utils"
import { eq, sql } from "drizzle-orm"

export const createProduct = async (values: ProductFormSchemaT) => {
  "use server"
  const { userId, shopId } = await getFromHeaders()

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

  return res
}

export const createTransaction = async (
  values: TransactionFormSchemaT,
  {
    type,
    products: productsList,
  }: {
    type: TransactionSchemaT["type"]
    products: ProductSchemaT[]
  }
) => {
  "use server"
  const { userId, shopId } = await getFromHeaders()
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
