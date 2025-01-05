import { FormActionBtns } from "@/components/button"
import { ProductForm } from "@/components/form"
import { PageHeader } from "@/components/layout/page-header"
import { RoleWrapper } from "@/components/wrappers"
import { db } from "@/db/(inv)/instance"
import { product } from "@/orm/(inv)/schema"
import { ProductFormProvider } from "@/providers/product-form"
import { getFromHeaders } from "@/utils/general"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type Props = {
  params: Promise<{
    shopId: string
    id: string
  }>
}
async function UpdateProductPage({ params }: Props) {
  const { id } = await params
  const data = await db.query.product.findFirst({
    where: eq(product.id, id),
  })

  return (
    <>
      <ProductFormProvider defaultValues={data}>
        <PageHeader
          title={"Update Product"}
          className="mb-2"
          renderRight={() => <FormActionBtns formId="product" />}
        />
        <ProductForm
          performAction={async (values) => {
            "use server"
            try {
              const { userId, shopId } = await getFromHeaders()
              await db
                .update(product)
                .set({
                  ...values,
                  shopId,
                  updatedBy: userId,
                })
                .where(eq(product.id, id))

              revalidatePath("/[lang]/[shopId]/product")
            } catch (error) {
              console.error(error)
            }
          }}
        />
      </ProductFormProvider>
    </>
  )
}

export default (args: Props) =>
  RoleWrapper({
    children: <UpdateProductPage {...args} />,
    requiredRole: "ADMIN",
  })
