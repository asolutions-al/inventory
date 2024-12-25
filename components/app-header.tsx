"use client"

import { useGetShopId } from "@/hooks"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"

export function AppHeader() {
  const pathname = usePathname()
  const shopId = useGetShopId()

  const paths = pathname
    .split("/")
    .filter((path) => path !== "" && path !== shopId)

  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1
            const isActive = isLast
            const href = `/${shopId}/${paths.slice(0, index + 1).join("/")}`
            console.log("href", href)
            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {isActive ? (
                    <BreadcrumbPage>{path}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{path}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
