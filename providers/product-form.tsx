"use client"

import { Form } from "@/components/ui/form"
import { productFormSchema, ProductFormSchemaT } from "@/db/(inv)/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"

const defaultValues: ProductFormSchemaT = {
  name: "",
  barcode: "",
  currentStock: 0,
  cost: 0,
  price: 0,
  commission: 0,
  status: "ACTIVE",
  description: "",
}

const ProductFormProvider = (
  props: PropsWithChildren<{ defaultValues?: ProductFormSchemaT }>
) => {
  const form = useForm<ProductFormSchemaT>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { ProductFormProvider }
