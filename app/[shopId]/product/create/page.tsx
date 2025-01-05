import { ProductForm } from "@/components/form"
import { FormHeader } from "@/components/layout/form-header"
import { RoleWrapper } from "@/components/wrappers"
import { createProduct } from "@/lib/supabase"
import { ProductFormProvider } from "@/providers/product-form"

async function CreateProductPage() {
  return (
    <ProductFormProvider>
      <div className="mb-4">
        <FormHeader title={"Create Product"} formId="product" />
      </div>
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
