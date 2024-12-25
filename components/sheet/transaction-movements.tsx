"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SelectMovementTypeWithUser } from "@/db/(inv)/schema"
import { useTranslations } from "next-intl"
import { DataTable, movementUserColumns } from "../data-table"

export async function TransactionMovementsSheet({
  data,
  open,
  onOpenChange,
}: {
  data: SelectMovementTypeWithUser[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t("Transaction Movements")}</SheetTitle>
          <SheetDescription>
            {data.length} {t("movements")}
          </SheetDescription>
        </SheetHeader>
        <DataTable columns={movementUserColumns} data={data} />
      </SheetContent>
    </Sheet>
  )
}
