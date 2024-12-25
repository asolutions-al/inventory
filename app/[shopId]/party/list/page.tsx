import { db } from "@/db/(inv)/instance"

import { DataTable, partyColumns } from "@/components/data-table"
import { ProductMovementsSheet } from "@/components/sheet/product-movements"
import { ParmTabs } from "@/components/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RoleWrapper } from "@/components/wrappers"
import { getMember } from "@/lib/supabase"
import { movement, products, status } from "@/orm/(inv)/schema"
import { Status } from "@/types"
import { getFromHeaders } from "@/utils/general"
import { and, desc, eq } from "drizzle-orm"
import { PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function PartyListPage({
  searchParams,
}: {
  searchParams: { status?: Status }
}) {
  const { status: statusParam = "ACTIVE" } = searchParams
  const t = await getTranslations()
  const { shopId } = getFromHeaders()

  const data = await db.query.party.findMany({
    where: and(eq(products.shopId, shopId), eq(products.status, statusParam)),
    orderBy: products.name,
  })

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <ParmTabs
          paramKey="status"
          defaultValue={statusParam}
          options={status.enumValues.map((status) => ({
            label: status,
            value: status,
          }))}
        />
        <RoleWrapper requiredRole="ADMIN">
          <Link href={`/${shopId}/party/create`}>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {t("Create party")}
              </span>
            </Button>
          </Link>
        </RoleWrapper>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>{t("Parties")}</CardTitle>
          <CardDescription>{t("Manage party activity")}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={partyColumns} data={data} />
        </CardContent>
      </Card>
    </>
  )
}

async function ProductMovements({ id }: { id?: string }) {
  if (!id) return null
  const { role } = (await getMember()) || {}
  const { userId } = getFromHeaders()

  const filters = [eq(movement.productId, id)]

  if (role === "MEMBER") filters.push(eq(movement.userId, userId))

  const movements = await db.query.movement.findMany({
    where: and(...filters),
    orderBy: desc(movement.createdAt),
    with: {
      user: true,
    },
  })
  return <ProductMovementsSheet data={movements} />
}
