"use client"

import { SortBtn } from "@/components/button"
import { ReceiptDialog } from "@/components/dialog/Receipt"
import { RowActionDropdown } from "@/components/dropdown"
import { TransactionMovementsSheet } from "@/components/sheet/transaction-movements"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  MovementWUserSchemaT,
  ProductSchemaT,
  TransactionSchemaT,
} from "@/db/(inv)/schema"
import { useClearSearchParams } from "@/hooks"
import { ColumnDef } from "@tanstack/react-table"
import { HistoryIcon, PrinterIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { DateCell } from "../cells"

const columns: ColumnDef<TransactionSchemaT>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <SortBtn text="Date" column={column} />,
    cell: ({ row }) => <DateCell date={row.original.date} />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <SortBtn text="Amount" column={column} />,
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortBtn text="Type" column={column} />,
    meta: {
      filterVariant: "select",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original

      return <Actions data={data} />
    },
  },
]

export const transactionColumns = columns

const Actions = ({ data }: { data: TransactionSchemaT }) => {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <div className="flex">
      <Link
        href={{
          pathname,
          query: {
            row: data.id,
            action: "movements",
          },
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <HistoryIcon size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("View Movements")}</p>
          </TooltipContent>
        </Tooltip>
      </Link>
      <Link
        href={{
          pathname,
          query: {
            row: data.id,
            action: "receipt",
          },
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <PrinterIcon size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("View Receipt")}</p>
          </TooltipContent>
        </Tooltip>
      </Link>
      <RowActionDropdown
        id={data.id!}
        hiddenBtns={["edit", "view", "duplicate"]}
      />
    </div>
  )
}

export function ActionDetails({
  action,
  data,
}: {
  action?: "movements" | "receipt"
  data: MovementWUserSchemaT[]
}) {
  const router = useRouter()
  const { path } = useClearSearchParams({ keys: ["row", "action"] })

  const onOpenChange = (open: boolean) => {
    if (open) return
    // @ts-ignore
    router.push(path)
  }

  return action === "receipt" ? (
    <ReceiptDialog
      date={new Date(data[0].createdAt)}
      movements={data}
      onOpenChange={onOpenChange}
      open={true}
      products={data.map((m) => m.productDetails as ProductSchemaT)}
    />
  ) : action === "movements" ? (
    <TransactionMovementsSheet
      open={true}
      data={data}
      onOpenChange={onOpenChange}
    />
  ) : null
}
