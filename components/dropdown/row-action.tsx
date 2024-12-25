"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Role } from "@/db/(inv)/schema"
import { useAppStore } from "@/providers/store-provider"
import {
  ClipboardIcon,
  EditIcon,
  MoreHorizontal,
  MoreVerticalIcon,
  Trash,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { toast } from "sonner"

type RowAction = "copy" | "edit" | "delete" | "view" | "duplicate"

const roleBasedActions: Record<Role, RowAction[]> = {
  ADMIN: ["copy", "edit", "delete", "view", "duplicate"],
  MEMBER: ["copy", "view"],
}

export function RowActionDropdown({
  id,
  hiddenBtns,
}: {
  id: string
  hiddenBtns?: RowAction[]
}) {
  const store = useAppStore((store) => store)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const updatedSearchParams = new URLSearchParams(searchParams)

  const actions: {
    id: RowAction
    name: string
    icon: JSX.Element
    onClick?: () => void
    href?: string
    seperator?: boolean
    shortcut?: string
    className?: string
  }[] = [
    {
      id: "copy",
      name: "Copy Id",
      icon: <ClipboardIcon size={15} className="mr-2" />,
      onClick: () => {
        try {
          navigator.clipboard.writeText(id)
          toast.success("Id copied to clipboard")
        } catch (error) {
          toast.error("Failed to copy id")
        }
      },
      seperator: true,
    },
    {
      id: "edit",
      name: "Edit",
      icon: <EditIcon size={15} className="mr-2" />,
      href: `${pathname}/update/${id}`,
    },
    {
      id: "duplicate",
      name: "Duplicate",
      icon: <EditIcon size={15} className="mr-2" />,
      href: `${pathname}/duplicate/${id}`,
    },
    {
      id: "delete",
      name: "Delete",
      icon: <Trash size={15} className="mr-2" />,
      href: `${pathname}?${updatedSearchParams.toString()}&row=${id}&action=delete`,
      className: "text-red-600",
      shortcut: "⌘⌫",
    },
    {
      id: "view",
      name: "View details",
      icon: <MoreVerticalIcon size={15} className="mr-2" />,
    },
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions.map((action) => {
          const isHidden =
            hiddenBtns?.includes(action.id) ||
            !roleBasedActions[store.role].includes(action.id)
          if (isHidden) return null
          return (
            <div key={action.name}>
              <LinkOrChildren href={action.href}>
                <DropdownMenuItem
                  onClick={action.onClick}
                  className={action.className}
                >
                  {action.icon}
                  {action.name}
                  {action.shortcut && (
                    <DropdownMenuShortcut>
                      {action.shortcut}
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              </LinkOrChildren>
              {action.seperator && <DropdownMenuSeparator />}
            </div>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const LinkOrChildren = ({
  href,
  children,
}: {
  href?: string
  children: any
}) => {
  // @ts-ignore
  return href ? <Link href={href}>{children}</Link> : children
}
