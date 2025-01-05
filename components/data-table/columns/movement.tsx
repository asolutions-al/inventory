"use client"

import { SortBtn } from "@/components/button"
import { MovementWUserSchemaT } from "@/db/(inv)/schema"
import { ColumnDef } from "@tanstack/react-table"
import { DateCell } from "../cells"

const movementUserColumns: ColumnDef<MovementWUserSchemaT>[] = [
  {
    accessorKey: "productDetails.name",
    header: ({ column }) => <SortBtn text="Product name" column={column} />,
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
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => <SortBtn text="User email" column={column} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortBtn text="Created at" column={column} />,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
]

const movementProductUserColumns: ColumnDef<MovementWUserSchemaT>[] = [
  {
    accessorKey: "product.name",
    header: ({ column }) => <SortBtn text="Product name" column={column} />,
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
    accessorKey: "user.email",
    header: ({ column }) => <SortBtn text="User email" column={column} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortBtn text="Created at" column={column} />,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
]

export { movementProductUserColumns, movementUserColumns }
