import { headers } from "next/headers"

export const getFromHeaders = async () => {
  const heads = await headers()
  const shopId = heads.get("x-shopId") as string
  const userId = heads.get("x-userId") as string
  return {
    shopId,
    userId,
  }
}
