import { SelectProductType } from "@/db/(inv)/schema"

export const calcProfit = (product: SelectProductType) => {
  return product.price - product.cost - product.commission
}
