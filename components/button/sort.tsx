import { Button } from "@/components/ui/button"
import { Messages } from "@/global"
import { Column } from "@tanstack/react-table"
import { ArrowUpDownIcon } from "lucide-react"

export const SortBtn = ({
  text,
  column,
}: {
  text: keyof Messages
  column: Column<any>
}) => {
  const t = (key: string) => key

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {t(text)}
      <ArrowUpDownIcon className="ml-2 h-4 w-4" />
    </Button>
  )
}
