import { headers } from "next/headers"

export const getFromHeaders = () => {
  const heads = headers()
  const shopId = heads.get("x-shopId") as string
  const userId = heads.get("x-userId") as string
  return {
    shopId,
    userId,
  }
}
