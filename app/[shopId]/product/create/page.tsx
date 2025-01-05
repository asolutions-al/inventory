import { FormActionBtns } from "@/components/button"
import { ProductForm } from "@/components/form"
import { PageHeader } from "@/components/layout/page-header"
import { RoleWrapper } from "@/components/wrappers"
import { createProduct } from "@/lib/supabase"
import { ProductFormProvider } from "@/providers/product-form"

async function CreateProductPage() {
  return (
    <ProductFormProvider>
      <PageHeader
        title={"Create Product"}
        className="mb-2"
        renderRight={() => <FormActionBtns formId="product" />}
      />
      <ProductForm
        performAction={async (values) => {
          "use server"
          await createProduct(values)
        }}
      />
    </ProductFormProvider>
  )
}

export default () =>
  RoleWrapper({ children: <CreateProductPage />, requiredRole: "ADMIN" })
