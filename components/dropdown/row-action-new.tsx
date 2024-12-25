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
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ComponentType, Fragment, PropsWithChildren } from "react"

export function RowActionDropdownNew({
  items,
}: {
  items: {
    name: string
    icon: JSX.Element
    onClick?: () => void
    href?: string
    shortcut?: string
    seperator?: boolean
    className?: string
    Wrapper?: ComponentType
  }[]
}) {
  const searchParams = useSearchParams()

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

        <DropdownMenuSeparator />

        {items.map((item) => {
          const Wrapper = item.Wrapper || Fragment
          return (
            <Wrapper key={item.name}>
              <div>
                <LinkOrChildren href={item.href}>
                  <DropdownMenuItem
                    onClick={item.onClick}
                    className={item.className}
                  >
                    {item.icon}
                    {item.name}
                    {item.shortcut && (
                      <DropdownMenuShortcut>
                        {item.shortcut}
                      </DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                </LinkOrChildren>
                {item.seperator && <DropdownMenuSeparator />}
              </div>
            </Wrapper>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
const LinkOrChildren = ({
  href,
  children,
}: PropsWithChildren<{ href?: string }>) =>
  // @ts-ignore
  href ? <Link href={href}>{children}</Link> : children
