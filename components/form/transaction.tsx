"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ProductSchemaT, TransactionSchemaT } from "@/db/(inv)/schema"
import { cn } from "@/lib/utils"
import { TransactionFormSchemaT } from "@/providers/transaction-form"
import { format } from "date-fns"
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { Combobox } from "../combobox"
import { Receipt, ReceiptDialog } from "../dialog/Receipt"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export type OrderFormTypes = {
  performAction: (values: TransactionFormSchemaT) => Promise<void>
  products: ProductSchemaT[]
  reasons: TransactionSchemaT["reason"][]
}

const formId: FormId = "transaction"

export function TransactionForm({
  performAction,
  products,
  reasons,
}: OrderFormTypes) {
  const t = useTranslations()
  const form = useFormContext<TransactionFormSchemaT>()

  const [receipt, setReceipt] = useState<Receipt>({
    open: false,
    onOpenChange: (open) => setReceipt((prev) => ({ ...prev, open })),
    movements: [
      {
        amount: 0,
        productId: "",
      },
    ],
    products: [],
    date: new Date(),
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: "movements",
  })

  async function onSubmit(values: TransactionFormSchemaT) {
    try {
      await performAction(values)
      form.reset()
      setReceipt({
        ...receipt,
        open: true,
        movements: values.movements,
        products,
        date: values.date,
      })
      toast.success(t("Transaction saved successfully"))
    } catch (error) {
      console.error("error", error)
      toast.error(t("An error occurred"))
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
        <main className="p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[60rem] flex-1 auto-rows-max gap-4">
            <Card className="w-full mx-auto">
              <CardHeader>
                <CardTitle>{t("Products")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {fieldArray.fields.map((field, index) => {
                  const canRemove = fieldArray.fields.length > 1
                  return (
                    <div key={field.id} className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`movements.${index}.productId`}
                        render={({ field }) => (
                          <FormItem className="flex-1 max-w-60">
                            <FormLabel>{t("Product")}</FormLabel>
                            <FormControl>
                              <div>
                                <Combobox
                                  list={products
                                    .filter(
                                      (product) => product.status === "ACTIVE"
                                    )
                                    .map((product) => ({
                                      value: product.id!,
                                      label: product.name,
                                      ...(product.barcode && {
                                        keywords: [product.barcode],
                                      }),
                                    }))}
                                  value={field.value}
                                  setValue={(value) => {
                                    field.onChange(value)
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`movements.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Amount")}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                onFocus={(e) => e.target.select()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        variant="outline"
                        onClick={() => {
                          if (!canRemove) return
                          fieldArray.remove(index)
                        }}
                        className="self-end"
                        type="button"
                      >
                        <TrashIcon size={15} className="mr-1" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          {t("Remove")}
                        </span>
                      </Button>
                    </div>
                  )
                })}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      fieldArray.append({
                        amount: 0,
                        productId: "",
                      })
                    }
                    type="button"
                  >
                    <PlusIcon className="h-4 w-4" />
                    {t("Add New Row")}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>{t("Details")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3 grid-cols-4">
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-4 sm:col-span-2 md:col-span-1">
                          <FormLabel>{t("Reason")}</FormLabel>
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger aria-label={t("Select Reason")}>
                                <SelectValue placeholder={t("Select Reason")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {reasons.map((item) => (
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
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-4 sm:col-span-2 md:col-span-1">
                          <FormLabel>{t("Date")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t("Pick a date")}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </form>

      <ReceiptDialog {...receipt} />
    </>
  )
}
