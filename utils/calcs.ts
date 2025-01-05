import { ProductSchemaT } from "@/db/(inv)/schema"

export const calcProfit = (product: ProductSchemaT) => {
  return product.price - product.cost - product.commission
}
