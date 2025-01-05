"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductSchemaT } from "@/db/(inv)/schema"
import dayjs from "dayjs"
import { PrinterIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "../ui/button"

export type Receipt = {
  open: boolean
  onOpenChange: (open: boolean) => void
  movements: {
    productId: string
    amount: number
  }[]
  products: ProductSchemaT[]
  date: Date
}

export function ReceiptDialog({
  open,
  onOpenChange,
  movements,
  products,
  date,
}: Receipt) {
  const t = useTranslations()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center border-b pb-4">
            {t("Receipt")}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            {t("Date")}: {dayjs(date).format("DD-MM-YYYY:HH:mm")}
          </div>
          <div className="grid grid-cols-6 py-2 border-b">
            <div className="font-medium col-span-3">{t("Product")}</div>
            <div className="font-medium">{t("Amount")}</div>
            <div className="font-medium">{t("Price")}</div>
            <div className="font-medium">{t("Total")}</div>
          </div>
          {movements.map((m) => {
            const product = products.find((p) => p.id === m.productId)
            const { name, price = 0 } = product || {}
            return (
              <div
                className="grid grid-cols-6 border-b border-dotted py-2"
                key={m.productId}
              >
                <div className="col-span-3">{name}</div>
                <div>{m.amount}</div>
                <div>{price}</div>
                <div>{m.amount * price}</div>
              </div>
            )
          })}

          <div className="grid grid-cols-6 py-2">
            <div className="col-span-3 font-semibold">{t("Total")}</div>
            <div className="font-semibold">
              {movements.reduce((acc, m) => acc + m.amount, 0)}
            </div>
            <div className="font-semibold">
              {movements.reduce(
                (acc, m) =>
                  acc +
                  (products.find((p) => p.id === m.productId)?.price || 0),
                0
              )}
            </div>
            <div className="font-semibold">
              {movements.reduce(
                (acc, m) =>
                  acc +
                  m.amount *
                    (products.find((p) => p.id === m.productId)?.price || 0),
                0
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="print:hidden">
          <Button
            type="button"
            onClick={() => {
              window.print()
            }}
          >
            <PrinterIcon className="mr-2" />
            {t("Print")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
