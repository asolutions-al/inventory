"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InsertFormShopType, insertFormShopSchema } from "@/db/(inv)/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useTranslations } from "next-intl"
import { PostgresError } from "postgres"
import { toast } from "sonner"

type Types = {
  performAction: (values: InsertFormShopType) => Promise<void>
}

export function ShopForm({ performAction }: Types) {
  const t = useTranslations()
  const form = useForm<InsertFormShopType>({
    resolver: zodResolver(insertFormShopSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: InsertFormShopType) {
    try {
      await performAction(values)
      form.reset()
      toast.success(t("Shop saved successfully"))
    } catch (error) {
      console.error("error", error)
      toast.error(
        (error as PostgresError)?.message ||
          "An error occurred. Please try again later."
      )
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Pizza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Description")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("A delicious pizza")}
                      {...field}
                      value={field?.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("Save")}</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
