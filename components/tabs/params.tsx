"use client"

import { Messages } from "@/global"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

type Option = {
  value: string
  label: keyof Messages
}
const ParmTabs = ({
  paramKey,
  options,
  defaultValue,
}: {
  defaultValue: string
  paramKey: string
  options: Option[]
}) => {
  const t = (key: string) => key
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <Tabs defaultValue={searchParams.get(paramKey) || defaultValue}>
      <TabsList>
        {options.map(({ value, label }) => (
          // @ts-ignore
          <Link key={value} passHref href={`${pathname}?${paramKey}=${value}`}>
            <TabsTrigger value={value}>{t(label)}</TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { ParmTabs }
