"use client"

import { useGetShopId } from "@/hooks"
import { usePathname, useRouter } from "next/navigation"
import { Combobox } from "./combobox"

export function ShopCombobox({
  list,
}: {
  list: { value: string; label: string }[]
}) {
  const shopId = useGetShopId()
  const router = useRouter()
  const pathname = usePathname()
  return (
    <>
      <Combobox
        list={list}
        value={shopId}
        setValue={(value) => {
          const path = pathname.replace(shopId, value)
          // @ts-ignore
          router.push(path)
        }}
      />
    </>
  )
}
