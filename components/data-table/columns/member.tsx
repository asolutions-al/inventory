"use client"

import { SortBtn } from "@/components/button"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SelectMemberTypeWithShopUser } from "@/db/(inv)/schema"
import { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DateCell } from "../cells/date"
import { useTranslations } from "next-intl"

const columns: ColumnDef<SelectMemberTypeWithShopUser>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortBtn text="Created at" column={column} />,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <SortBtn text="Role" column={column} />,
    cell: ({ row }) => {
      const t = useTranslations()
      return t(row.original.role)
    },
  },
  {
    accessorKey: "user_userId.email",
    header: ({ column }) => <SortBtn text="User email" column={column} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original

      return <Actions data={data} />
    },
  },
]

export const memberColumns = columns

const Actions = ({ data }: { data: any }) => {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <div className="flex">
      <Link
        href={{
          pathname,
          query: {
            row: data.id,
            action: "delete",
          },
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <Trash size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Remove from team")}</p>
          </TooltipContent>
        </Tooltip>
      </Link>
    </div>
  )
}
