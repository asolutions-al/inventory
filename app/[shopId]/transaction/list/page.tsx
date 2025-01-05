import {
  ActionDetails,
  DataTable,
  transactionColumns,
} from "@/components/data-table"
import { db } from "@/db/(inv)/instance"

import { ConfirmDialog } from "@/components/dialog"
import { RangeTab } from "@/components/tab"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RANGE_TO_DATE_MAP } from "@/contants/maps"
import { getMember } from "@/lib/supabase"
import { movement, product, transaction } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import { getTranslations } from "next-intl/server"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    row?: string
    action?: "movements" | "delete" | "receipt"
    range?: RangeT
  }>
}) {
  const t = await getTranslations()
  const { role } = (await getMember()) || {}
  const { row, action, range = "TODAY" } = await searchParams

  const { getStart, getEnd } = RANGE_TO_DATE_MAP[range]
  const start = getStart()
  const end = getEnd()

  const { shopId, userId } = await getFromHeaders()

  const qry = [
    eq(transaction.shopId, shopId),
    gte(transaction.date, start.toISOString()),
    lte(transaction.date, end.toISOString()),
  ]

  if (role !== "ADMIN") qry.push(eq(transaction.updatedBy, userId))

  const data = await db.query.transaction.findMany({
    where: and(...qry),
    orderBy: desc(transaction.date),
  })

  const deleteTrans = async () => {
    "use server"
    const { row } = await searchParams
    if (!row) return //TODO: handle
    const movements = await db.query.movement.findMany({
      where: eq(movement.transactionId, row),
    })
    movements.forEach(async (m) => {
      // TODO: what could be a better way?
      await db
        .update(product)
        .set({
          currentStock: sql`${product.currentStock} + ${
            m.amount * (m.type === "IN" ? -1 : 1)
          }`,
        })
        .where(eq(product.id, m.productId))
    })
    await db.delete(transaction).where(eq(transaction.id, row)) // cascade will delete movements
  }

  return (
    <>
      <div className="mb-2">
        <RangeTab defaultValue="TODAY" />
      </div>

      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>{t("Transactions")}</CardTitle>
          <CardDescription>
            {t("Manage your transactions and view their sales performance")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={transactionColumns} data={data} />
        </CardContent>
      </Card>

      {(action === "movements" || action === "receipt") && (
        <SSActionDetails id={row} action={action} />
      )}
      {action === "delete" && (
        <ConfirmDialog
          performAction={deleteTrans}
          action="Delete"
          table="Transaction"
          extraDescription="All movements and stock changes will be reverted"
        />
      )}
    </>
  )
}

async function SSActionDetails({
  id,
  action,
}: {
  id?: string
  action?: "movements" | "receipt"
}) {
  if (!id) return null
  const movements = await db.query.movement.findMany({
    where: eq(movement.transactionId, id),
    with: {
      user: true,
    },
  })

  // @ts-ignore
  return <ActionDetails data={movements} action={action} />
}
