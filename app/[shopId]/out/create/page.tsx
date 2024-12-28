import { TransactionForm } from "@/components/form"
import { db } from "@/db/(inv)/instance"
import { SelectTransactionType } from "@/db/(inv)/schema"
import { createTransaction } from "@/lib/supabase"
import { product } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { eq } from "drizzle-orm"

const type: SelectTransactionType["type"] = "OUT"

export default async function OrderPage() {
  const { shopId } = await getFromHeaders()
  const productsList = await db.query.product.findMany({
    where: eq(product.shopId, shopId),
    orderBy: product.name,
  })

  return (
    <TransactionForm
      type={type}
      products={productsList}
      performAction={async (values) => {
        "use server"
        createTransaction(values, { type, products: productsList })
      }}
      reasons={["SALE", "WASTE", "INTERNAL_USE", "TRANSFER", "ADJUSMENT"]}
    />
  )
}

// export default () =>
//   RoleWrapper({ children: <OrderPage />, requiredRole: "ADMIN" });
