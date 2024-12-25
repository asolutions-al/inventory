"use client"

import { useParams } from "next/navigation"

export function useGetShopId() {
  const { shopId } = useParams()
  return shopId as string
}
