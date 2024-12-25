import { ProductForm } from "@/components/form"
import { RoleWrapper } from "@/components/wrappers"
import {
  createCategory,
  createProduct,
  deleteCategory,
  getCategories,
} from "@/lib/supabase"
import { uploadProductImages } from "@/lib/supabase/edge-actions"
import { getTranslations } from "next-intl/server"

async function CreateProductPage() {
  const t = await getTranslations()
  const categoriesList = await getCategories()
  return (
    <>
      <ProductForm
        categoriesList={categoriesList}
        title={t("Create Product")}
        performAction={async (values, formData) => {
          "use server"
          const res = await createProduct(values)
          if (formData) await uploadProductImages({ id: res.id, formData })
        }}
        createNewCategory={createCategory}
        deleteCategory={deleteCategory}
      />
    </>
  )
}

export default () =>
  RoleWrapper({ children: <CreateProductPage />, requiredRole: "ADMIN" })
