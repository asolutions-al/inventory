"use client"

import { Form } from "@/components/ui/form"
import { movement, transaction } from "@/orm/(inv)/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = createInsertSchema(transaction, {
  date: z.date(),
})
  .omit({
    shopId: true,
    type: true,
    amount: true,
    updatedBy: true,
    createdAt: true,
    id: true,
  })
  .extend({
    movements: z.array(
      createInsertSchema(movement, {
        amount: (sch) => sch.amount.positive(),
      }).omit({
        transactionId: true,
        type: true,
        updatedBy: true,
        shopId: true,
        productDetails: true,
        createdAt: true,
        id: true,
      })
    ),
  })

type SchemaT = z.infer<typeof schema>

const defaultValues: SchemaT = {
  date: new Date(),
  reason: "PURCHASE",
  movements: [
    {
      amount: 0,
      productId: "",
    },
  ],
}

const TransactionFormProvider = (
  props: PropsWithChildren<{ defaultValues?: SchemaT }>
) => {
  const form = useForm<SchemaT>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...props.defaultValues },
  })

  return <Form {...form}>{props.children}</Form>
}

export { TransactionFormProvider, type SchemaT as TransactionFormSchemaT }
