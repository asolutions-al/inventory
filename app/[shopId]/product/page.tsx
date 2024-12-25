import { db } from "@/db/(inv)/instance"

import { PlusCircle } from "lucide-react"

import { DataTable, productColumns } from "@/components/data-table"
import { ConfirmDialog } from "@/components/dialog"
import { ProductMovementsSheet } from "@/components/sheet/product-movements"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleWrapper } from "@/components/wrappers"
import { TAB_START_END } from "@/contants/maps"
import { useStatusTabs } from "@/hooks"
import { getMember } from "@/lib/supabase"
import { movement, product, status } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { differenceInDays, isBefore } from "date-fns"
import { and, desc, eq, gte, lte } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { row?: string; action?: "movements" | "delete"; tab?: string }
}) {
  const t = await getTranslations()
  const { getStart, getEnd } = TAB_START_END["LAST30DAYS"]
  const { validTab } = useStatusTabs({ tabParam: searchParams.tab })
  const { row, action } = searchParams
  const { shopId } = getFromHeaders()
  const data = await db.query.product.findMany({
    where: and(eq(product.shopId, shopId), eq(product.status, validTab)),
    orderBy: product.name,
    with: {
      // category: true,
      // productImages: true,
    },
  })
  console.log("data", data)

  const movements = await db.query.movement.findMany({
    where: and(
      eq(movement.shopId, shopId),
      gte(movement.createdAt, getStart().toISOString()),
      lte(movement.createdAt, getEnd().toISOString())
    ),
  })

  const finalData = data.map((product) => {
    const outMovements = movements.filter(
      (movement) => movement.productId === product.id && movement.type === "OUT"
    )
    const total = outMovements.reduce(
      (acc, movement) => acc + movement.amount,
      0
    )

    /**
     * If the product was created before the start date, we divide by 30
     * Otherwise, for new products, we divide by the number of days since the product was created for a more accurate stock left
     */
    const divider = isBefore(product.createdAt, getStart())
      ? 30
      : differenceInDays(getEnd(), product.createdAt)

    const finalDivider = divider === 0 ? 1 : divider

    const soldPerDay = total / finalDivider
    const stockLeft = product.currentStock / soldPerDay
    return {
      ...product,
      stockLeft,
    }
  })

  const deleteAction = async () => {
    "use server"
    // TODO:
  }

  return (
    <>
      <Tabs defaultValue={status.enumValues[1]}>
        <div className="flex items-center">
          <TabsList>
            {status.enumValues.map((status) => (
              <Link
                key={status}
                href={`/${shopId}/product?tab=${status}`}
                passHref
              >
                <TabsTrigger value={status}>{t(status)}</TabsTrigger>
              </Link>
            ))}
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <RoleWrapper requiredRole="ADMIN">
              <Link href={`/${shopId}/product/create`}>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t("Add Product")}
                  </span>
                </Button>
              </Link>
            </RoleWrapper>
          </div>
        </div>
      </Tabs>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>{t("Products")}</CardTitle>
          <CardDescription>
            {t("Manage your products and view their sales performance")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* @ts-ignore */}
          <DataTable columns={productColumns} data={finalData} />
        </CardContent>
      </Card>
      {action === "movements" && <ProductMovements id={row} />}

      {action === "delete" && (
        <ConfirmDialog
          performAction={deleteAction}
          action="Delete"
          table="Product"
          extraDescription="All movements and transactions will be deleted"
        />
      )}
    </>
  )
}

async function ProductMovements({ id }: { id?: string }) {
  if (!id) return null
  const { role } = (await getMember()) || {}
  const { userId } = getFromHeaders()

  const filters = [eq(movement.productId, id)]

  if (role === "MEMBER") filters.push(eq(movement.updatedBy, userId))

  const movements = await db.query.movement.findMany({
    where: and(...filters),
    orderBy: desc(movement.createdAt),
    with: {
      user: true,
    },
  })
  // @ts-ignore
  return <ProductMovementsSheet data={movements} />
}
