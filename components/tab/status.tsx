"use client"

import { status } from "@/orm/(inv)/schema"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

const StatusTab = ({
  defaultValue,
}: {
  defaultValue: (typeof status.enumValues)[number]
}) => {
  const t = useTranslations()
  const pathname = usePathname()
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {status.enumValues.map((status) => (
          <Link
            key={status}
            href={{
              pathname,
              query: { tab: status },
            }}
            passHref
          >
            <TabsTrigger value={status}>{t(status)}</TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { StatusTab }
