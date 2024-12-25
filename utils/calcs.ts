import { SelectProductType } from "@/db/(inv)/schema"

export const calcProfit = (product: SelectProductType) => {
  console.log(product)
  return product.price - product.cost - product.commission
}
