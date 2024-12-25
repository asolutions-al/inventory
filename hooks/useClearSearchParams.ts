"use client"

import { usePathname, useSearchParams } from "next/navigation"

export const useClearSearchParams = ({ keys }: { keys: string[] }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const updatedSearchParams = new URLSearchParams(searchParams)

  keys.forEach((key) => updatedSearchParams.delete(key))

  const path = `${pathname}?${updatedSearchParams.toString()}`

  return { path }
}
