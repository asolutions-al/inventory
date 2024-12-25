import { ProductForm } from "@/components/form"
import { RoleWrapper } from "@/components/wrappers"
import { db } from "@/db/(inv)/instance"
import {
  createCategory,
  createProduct,
  deleteCategory,
  getCategories,
} from "@/lib/supabase"
import { uploadProductImages } from "@/lib/supabase/edge-actions"
import { products } from "@/orm/(inv)/schema"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"

type Args = {
  params: {
    shopId: string
    id: string
  }
}

async function DuplicateProductPage({ params }: Args) {
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
        title={t("Duplicate Product")}
        performAction={async (values, formData) => {
          "use server"
          const res = await createProduct(values)
          if (formData) await uploadProductImages({ id: res.id, formData })
        }}
        categoriesList={categoriesList}
        defaultValues={data}
        createNewCategory={createCategory}
        deleteCategory={deleteCategory}
      />
    </>
  )
}

export default (args: Args) =>
  RoleWrapper({
    children: <DuplicateProductPage {...args} />,
    requiredRole: "ADMIN",
  })
