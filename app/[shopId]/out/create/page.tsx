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

const type: TransactionSchemaT["type"] = "OUT"

export default async function OrderPage() {
  const { shopId } = await getFromHeaders()
  const productsList = await db.query.product.findMany({
    where: eq(product.shopId, shopId),
    orderBy: product.name,
  })

  return (
    <TransactionFormProvider>
      <PageHeader
        title={"Create Out"}
        className="mb-2"
        renderRight={() => <FormActionBtns formId="transaction" />}
      />
      <TransactionForm
        products={productsList}
        performAction={async (values) => {
          "use server"
          createTransaction(values, { type, products: productsList })
        }}
        reasons={["SALE", "WASTE", "INTERNAL_USE", "TRANSFER", "ADJUSMENT"]}
      />
    </TransactionFormProvider>
  )
}
