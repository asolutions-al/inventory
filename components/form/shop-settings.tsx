"use client"

import {
  insertFormShopSchema,
  InsertFormShopType,
  SelectShopType,
} from "@/db/(inv)/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PostgresError } from "postgres"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

export function ShopSettingsForm({
  defaultValues,
  performAction,
}: {
  defaultValues?: SelectShopType
  performAction: (values: InsertFormShopType) => Promise<void>
}) {
  const t = (key: string) => key
  const form = useForm<InsertFormShopType>({
    resolver: zodResolver(insertFormShopSchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  })

  async function onSubmit(values: InsertFormShopType) {
    try {
      await performAction(values)
      toast.success(t("Shop saved successfully"))
    } catch (error) {
      console.error("error", error)
      toast(
        (error as PostgresError)?.message ||
          "An error occurred. Please try again later."
      )
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        id="shop-settings-form"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="My Shop" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
