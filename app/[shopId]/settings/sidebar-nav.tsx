"use client"

import { buttonVariants } from "@/components/ui/button"
import { Messages } from "@/global"
import { useGetShopId } from "@/hooks"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: keyof Messages
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const shopId = useGetShopId()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const href = `/${shopId}${item.href}`
        return (
          <Link
            key={item.href}
            // @ts-ignore
            href={href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {t(item.title)}
          </Link>
        )
      })}
    </nav>
  )
}
