"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  insertMovementFormSchema,
  insertTransactionFormSchema,
  ProductSchemaT,
  SelectTransactionType,
} from "@/db/(inv)/schema"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import {
  CalendarIcon,
  CheckIcon,
  Eraser,
  PlusIcon,
  TrashIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { PostgresError } from "postgres"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { BackButton } from "../button/back"
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
  products: ProductSchemaT[]
  performAction: (values: TransactionSchemaType) => Promise<void>
  type: SelectTransactionType["type"]
  reasons: SelectTransactionType["reason"][]
}

const schema = insertTransactionFormSchema.extend({
  movements: z.array(
    insertMovementFormSchema.omit({
      transactionId: true,
      type: true,
      // userId: true,
      updatedBy: true,
      shopId: true,
      productDetails: true,
    })
  ),
})
export type TransactionSchemaType = z.infer<typeof schema>

export function TransactionForm({
  performAction,
  products,
  type,
  reasons,
}: OrderFormTypes) {
  const t = useTranslations()
  const params = useSearchParams()

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

  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      movements: [
        {
          amount: 0,
          productId: "",
        },
      ],
      date: new Date(),
      reason: type === "IN" ? "PURCHASE" : "SALE",
    },
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: "movements",
  })

  async function onSubmit(values: TransactionSchemaType) {
    try {
      await performAction(values)
      form.reset()
      setReceipt({
        ...receipt,
        open: true,
        movements: values.movements,
        products,
        date: new Date(),
      })
      toast.success(t("Type saved successfully", { type: t(type) }))
    } catch (error) {
      console.error("error", error)
      toast.error(
        (error as PostgresError)?.message ||
          "An error occurred. Please try again later."
      )
    }
  }

  const onDiscard = () => {
    form.reset()
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <main className="p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <BackButton />
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  {t("Create Type", { type: t(type) })}
                </h1>
                <div className="hidden gap-2 md:ml-auto md:block">
                  <SubmitBtns onDiscard={onDiscard} />
                </div>
              </div>

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
                                  <SelectValue
                                    placeholder={t("Select Reason")}
                                  />
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
              <div className="flex justify-center md:hidden">
                <SubmitBtns onDiscard={onDiscard} />
              </div>
            </div>
          </main>
        </form>
      </Form>

      <ReceiptDialog {...receipt} />
    </>
  )
}

const SubmitBtns = ({ onDiscard }: { onDiscard: () => void }) => {
  const t = useTranslations()
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" type="button" onClick={onDiscard}>
        <Eraser size={15} className="mr-1" />
        {t("Discard")}
      </Button>
      <Button size="sm" type="submit">
        <CheckIcon size={15} className="mr-1" />
        {t("Save Transaction")}
      </Button>
    </div>
  )
}
