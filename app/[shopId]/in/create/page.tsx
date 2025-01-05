import { FormActionBtns } from "@/components/button"
import { TransactionForm } from "@/components/form"
import { PageHeader } from "@/components/layout"
import { db } from "@/db/(inv)/instance"
import { TransactionSchemaT } from "@/db/(inv)/schema"
import { createTransaction } from "@/lib/supabase"
import { product } from "@/orm/(inv)/schema"
import { TransactionFormProvider } from "@/providers/transaction-form"
import { getFromHeaders } from "@/utils/general"
import { eq } from "drizzle-orm"

const type: TransactionSchemaT["type"] = "IN"

export default async function OrderPage() {
  const { shopId } = await getFromHeaders()
  const productsList = await db.query.product.findMany({
    where: eq(product.shopId, shopId),
    orderBy: product.name,
  })

  return (
    <TransactionFormProvider>
      <PageHeader
        title={"Create In"}
        className="mb-2"
        renderRight={() => <FormActionBtns formId="transaction" />}
      />
      <TransactionForm
        products={productsList}
        reasons={["PURCHASE", "FOUND", "TRANSFER", "ADJUSMENT"]}
        performAction={async (values) => {
          "use server"
          createTransaction(values, { type, products: productsList })
        }}
      />
    </TransactionFormProvider>
  )
}

// export default () =>
//   RoleWrapper({ children: <OrderPage />, requiredRole: "ADMIN" });
