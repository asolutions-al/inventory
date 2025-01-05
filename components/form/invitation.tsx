"use client"

import {
  InsertInvitationFormType,
  insertInvitationFormSchema,
} from "@/db/(inv)/schema"
import { role } from "@/orm/(inv)/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export function InvitationForm({
  onSubmit,
}: {
  onSubmit: (values: InsertInvitationFormType) => Promise<{
    id: string
  }>
}) {
  const t = useTranslations()

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const form = useForm<InsertInvitationFormType>({
    resolver: zodResolver(insertInvitationFormSchema),
    defaultValues: {
      role: "MEMBER",
    },
  })

  async function onValid(values: InsertInvitationFormType) {
    try {
      const res = await onSubmit(values)
      const updatedSearchParams = new URLSearchParams(searchParams)
      updatedSearchParams.set("invitation", res.id)
      // @ts-ignore
      router.push(`${pathname}?${updatedSearchParams.toString()}`)
      toast.success(t("Invitation created successfully"))
    } catch (error) {
      console.error("error", error)
      toast(t("An error occurred"))
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="space-y-8">
        <div className="grid gap-2 grid-cols-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Role")}</FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger aria-label="Select role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {role.enumValues.map((val) => (
                      <SelectItem key={val} value={val}>
                        {t(val)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="self-end">
            <PlusCircleIcon className="w-4 h-4 mr-2" />
            {t("Create Link")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
