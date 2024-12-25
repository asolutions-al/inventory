"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { partyFormSchema, PartyFormSchema } from "@/db/(inv)/schema"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { FormSubmitBtns } from "@/components/button"
import { FormHeader } from "@/components/form-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Messages } from "@/global"
import { party_type, status } from "@/orm/(inv)/schema"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

type Props = {
  onSubmit: (values: PartyFormSchema) => Promise<void>
  defaultValues?: PartyFormSchema
  title: keyof Messages
}

function PartyForm({ defaultValues, onSubmit, title }: Props) {
  const t = useTranslations()
  const form = useForm<PartyFormSchema>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      status: defaultValues?.status || "ACTIVE",
      type: defaultValues?.type || "CUSTOMER",
    },
  })

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            async (values) => {
              try {
                await onSubmit(values)
                form.reset()
                toast.success(t("Party saved"))
              } catch (error) {
                console.error("error", error)
              }
            },
            (e) => console.log("e", e)
          )}
          className="max-w-[58rem] mx-auto"
        >
          <FormHeader title={title} form={form} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            <Card x-chunk="dashboard-07-chunk-0" className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("Details")}</CardTitle>
                <CardDescription>{t("General information")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
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
                  </div>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Type")}</FormLabel>
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger aria-label={t("Select type")}>
                              <SelectValue placeholder={t("Select type")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {party_type.enumValues.map((item) => (
                              <SelectItem key={item} value={item}>
                                {t(item)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>{t("Product Status")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Status")}</FormLabel>
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger aria-label={t("Select status")}>
                                <SelectValue placeholder={t("Select status")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {status.enumValues.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {t(item)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="ml-auto mt-3 sm:hidden">
            <FormSubmitBtns form={form} />
          </div>
        </form>
      </Form>
    </>
  )
}

export { PartyForm }
