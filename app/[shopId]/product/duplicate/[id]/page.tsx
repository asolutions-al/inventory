import { FormActionBtns } from "@/components/button"
import { ProductForm } from "@/components/form"
import { PageHeader } from "@/components/layout/page-header"
import { RoleWrapper } from "@/components/wrappers"
import { db } from "@/db/(inv)/instance"
import { createProduct } from "@/lib/supabase"
import { product } from "@/orm/(inv)/schema"
import { ProductFormProvider } from "@/providers/product-form"
import { eq } from "drizzle-orm"

type Props = {
  params: Promise<{
    shopId: string
    id: string
  }>
}

async function DuplicateProductPage({ params }: Props) {
  const { id } = await params
  const data = await db.query.product.findFirst({
    where: eq(product.id, id),
  })

  return (
    <>
      <ProductFormProvider defaultValues={data}>
        <PageHeader
          title={"Duplicate Product"}
          className="mb-2"
          renderRight={() => <FormActionBtns formId="product" />}
        />
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

export default (args: Props) =>
  RoleWrapper({
    children: <DuplicateProductPage {...args} />,
    requiredRole: "ADMIN",
  })
