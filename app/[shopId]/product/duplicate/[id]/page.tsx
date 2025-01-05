import { ProductForm } from "@/components/form"
import { FormHeader } from "@/components/layout/form-header"
import { RoleWrapper } from "@/components/wrappers"
import { db } from "@/db/(inv)/instance"
import { createProduct } from "@/lib/supabase"
import { product } from "@/orm/(inv)/schema"
import { ProductFormProvider } from "@/providers/product-form"
import { eq } from "drizzle-orm"

type Args = {
  params: Promise<{
    shopId: string
    id: string
  }>
}

async function DuplicateProductPage({ params }: Args) {
  const { id } = await params
  const data = await db.query.product.findFirst({
    where: eq(product.id, id),
  })

  return (
    <>
      <ProductFormProvider defaultValues={data}>
        <div className="mb-4">
          <FormHeader title={"Duplicate Product"} formId="product" />
        </div>
        <ProductForm
          performAction={async (values) => {
            "use server"
            const res = await createProduct(values)
          }}
        />
      </ProductFormProvider>
    </>
  )
}

export default (args: Args) =>
  RoleWrapper({
    children: <DuplicateProductPage {...args} />,
    requiredRole: "ADMIN",
  })
