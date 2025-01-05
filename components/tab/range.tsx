"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

const LIST: RangeT[] = ["TODAY", "YESTERDAY", "WEEK", "MONTH", "QUARTER"]

const RangeTab = ({ defaultValue }: { defaultValue: RangeT }) => {
  const t = useTranslations()
  const pathname = usePathname()
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {LIST.map((item) => (
          <Link
            key={item}
            href={{
              pathname,
              query: { range: item },
            }}
            passHref
          >
            <TabsTrigger value={item}>{t(item)}</TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { RangeTab }
