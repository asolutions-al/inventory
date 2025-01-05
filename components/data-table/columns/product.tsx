"use client"

import { SortBtn } from "@/components/button"
import { RowActionDropdownNew } from "@/components/dropdown/row-action-new"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ProductSchemaT } from "@/db/(inv)/schema"
import { useGetShopId } from "@/hooks"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CopyPlusIcon, EditIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

type SelectProduct = ProductSchemaT & {
  stockLeft: number | typeof Infinity | typeof NaN // could be infinity or NaN, in case the product has never been sold, due to division by 0
  // productImages: SelectProductImagesType[]
}

const columns: ColumnDef<SelectProduct>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
    cell: ({ row }) => {
      const data = row.original
      // const imageSrc = data.productImages?.[0]?.url
      const imageSrc = ""
      return (
        <div className="flex items-center gap-4">
          <Avatar>
            {imageSrc ? (
              <AvatarImage src={imageSrc} alt={data.name} />
            ) : (
              <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          {data.name}
        </div>
      )
    },
  },
  // {
  //   accessorKey: "category.name",
  //   header: ({ column }) => <SortBtn text="Category" column={column} />,
  //   cell: ({ row }) => {
  //     const data = row.original
  //     const { color, name } = data.category || {}
  //     return (
  //       <div className="flex items-center gap-4">
  //         {color && (
  //           <div
  //             style={{ background: color }}
  //             className="rounded-md h-6 w-6 active:scale-105"
  //           />
  //         )}
  //         {name}
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: "currentStock",
    header: ({ column }) => <SortBtn text="Current Stock" column={column} />,
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "stockLeft",
    header: ({ column }) => {
      const t = useTranslations()
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SortBtn text="Stock Left" column={column} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {t(
                  "An estimate of the number of days left before the product runs out of stock"
                )}
              </p>
              <p>
                {t(
                  "Calculated based on the average number of products sold per day"
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },

    meta: {
      filterVariant: "range",
    },
    cell: ({ row }) => {
      const t = useTranslations()
      const data = row.original
      const { stockLeft } = data
      const hasNoSales = stockLeft === Infinity || isNaN(stockLeft)

      const textColor = hasNoSales
        ? "text-gray-500"
        : stockLeft <= 3
          ? "text-red-500"
          : stockLeft <= 7
            ? "text-yellow-500"
            : "text-black"

      return (
        <span className={textColor}>
          {hasNoSales
            ? t("Never Sold")
            : `${Math.round(stockLeft)} ( ${t("days")} )`}
        </span>
      )
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => <SortBtn text="Cost" column={column} />,
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortBtn text="Price" column={column} />,
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "commission",
    header: ({ column }) => <SortBtn text="Commission" column={column} />,
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "barcode",
    header: ({ column }) => <SortBtn text="Barcode" column={column} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortBtn text="Status" column={column} />,
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

export const productColumns = columns

const Actions = ({ data }: { data: ProductSchemaT }) => {
  const t = useTranslations()
  const pathname = usePathname()
  const shopId = useGetShopId()

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
              <ArrowUpDown size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("View Movements")}</p>
          </TooltipContent>
        </Tooltip>
      </Link>
      <RowActionDropdownNew
        items={[
          {
            icon: <EditIcon />,
            name: t("Edit"),
            href: `/${shopId}/product/update/${data.id}`,
          },
          {
            name: t("Duplicate"),
            icon: <CopyPlusIcon size={15} className="mr-2" />,
            href: `/${shopId}/product/duplicate/${data.id}`,
            seperator: true,
          },
        ]}
      />
    </div>
  )
}
