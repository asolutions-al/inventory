import { ProductForm } from "@/components/form"
import { RoleWrapper } from "@/components/wrappers"
import { db } from "@/db/(inv)/instance"
import { createCategory, deleteCategory, getCategories } from "@/lib/supabase"
import { uploadProductImages } from "@/lib/supabase/edge-actions"
import { products } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { revalidatePath } from "next/cache"

type Args = {
  params: {
    shopId: string
    id: string
  }
}
async function UpdateProductPage({ params }: Args) {
  const t = await getTranslations()
  const { id } = params
  const data = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { productImages: true },
  })
  const categoriesList = await getCategories()

  return (
    <>
      <ProductForm
        title={t("Update Product")}
        performAction={async (values, formData) => {
          "use server"
          try {
            const { userId, shopId } = getFromHeaders()
            const [res] = await db
              .update(products)
              .set({
                ...values,
                shopId,
                userId,
              })
              .where(eq(products.id, id))
              .returning({
                id: products.id,
              })

            if (formData) await uploadProductImages({ id: res.id, formData })

            revalidatePath("/[lang]/[shopId]/products")
          } catch (error) {
            console.error(error)
          }
        }}
        defaultValues={data}
        categoriesList={categoriesList}
        createNewCategory={createCategory}
        deleteCategory={deleteCategory}
      />
    </>
  )
}
export default (args: Args) =>
  RoleWrapper({
    children: <UpdateProductPage {...args} />,
    requiredRole: "ADMIN",
  })
