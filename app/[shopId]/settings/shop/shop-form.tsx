"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  insertFormShopSchema,
  InsertFormShopType,
  SelectShopType,
} from "@/db/(inv)/schema"
import { PostgresError } from "postgres"
import { toast } from "sonner"

export function ShopForm({
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Shop name")} {...field} />
              </FormControl>
              <FormDescription>
                {t("Used to identify your store")}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t("Update")}</Button>
      </form>
    </Form>
  )
}
