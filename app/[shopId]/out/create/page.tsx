import { TransactionForm } from "@/components/form"
import { db } from "@/db/(inv)/instance"
import { SelectTransactionType } from "@/db/(inv)/schema"
import { createTransaction } from "@/lib/supabase"
import { products } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { eq } from "drizzle-orm"

const type: SelectTransactionType["type"] = "OUT"

export default async function OrderPage() {
  const { shopId } = getFromHeaders()
  const productsList = await db.query.products.findMany({
    where: eq(products.shopId, shopId),
    orderBy: products.name,
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
