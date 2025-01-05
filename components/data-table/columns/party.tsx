"use client"

import { SortBtn } from "@/components/button"
import { ConfirmDialogNew } from "@/components/dialog/confirm-new"
import { RowActionDropdownNew } from "@/components/dropdown/row-action-new"
import { DialogTrigger } from "@/components/ui/dialog"
import { deleteParty } from "@/db/(inv)/actions"
import { PartySelectSchema } from "@/db/(inv)/schema"
import { useGetShopId } from "@/hooks"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"

const Actions = (props: CellContext<PartySelectSchema, unknown>) => {
  const shopId = useGetShopId()
  return (
    <>
      <ConfirmDialogNew
        title="Delete party"
        description="Are you sure you want to delete this party"
        onConfirm={async () => {
          try {
            await deleteParty(props.row.original.id)
          } catch (error) {
            console.error(error)
            throw error
          }
        }}
      >
        <RowActionDropdownNew
          items={[
            {
              icon: <Edit />,
              name: "Edit",
              href: `/${shopId}/party/update/${props.row.original.id}`,
              seperator: true,
            },
            {
              name: "Delete",
              icon: <Trash size={15} className="mr-2" />,
              className: "text-red-600",
              shortcut: "⌘⌫",
              onClick: () => {},
              Wrapper: DialogTrigger,
            },
          ]}
        />
      </ConfirmDialogNew>
    </>
  )
}

const columns: ColumnDef<PartySelectSchema>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortBtn text="Name" column={column} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortBtn text="Status" column={column} />,
    meta: {
      filterVariant: "select",
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
    cell: Actions,
  },
]

export { columns as partyColumns }
