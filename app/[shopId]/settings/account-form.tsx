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
  insertUserFormSchema,
  InsertUserFormType,
  SelectUserType,
} from "@/db/(inv)/schema"
import { useTranslations } from "next-intl"

export function AccountForm({
  defaultValues,
}: {
  defaultValues?: SelectUserType
}) {
  const t = useTranslations()
  const form = useForm<InsertUserFormType>({
    resolver: zodResolver(insertUserFormSchema),
    defaultValues,
  })

  function onSubmit(data: InsertUserFormType) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Your email")} {...field} disabled />
              </FormControl>
              <FormDescription>
                {t(
                  "This is the email address you use to sign in to your account"
                )}
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled>
          {t("Update")}
        </Button>
      </form>
    </Form>
  )
}
