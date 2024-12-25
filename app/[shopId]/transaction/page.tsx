import {
  ActionDetails,
  DataTable,
  transactionColumns,
} from "@/components/data-table"
import { db } from "@/db/(inv)/instance"

import { ConfirmDialog } from "@/components/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DATE_TABS } from "@/contants/list"
import { useDateTabs } from "@/hooks"
import { getMember } from "@/lib/supabase"
import { movement, product, transaction } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: {
    row?: string
    action?: "movements" | "delete" | "receipt"
    tab?: string
  }
}) {
  const t = await getTranslations()
  const { role } = (await getMember()) || {}
  const { row, action, tab } = searchParams
  const { start, end, validTab } = useDateTabs({ tabParam: tab })
  const { shopId, userId } = getFromHeaders()

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
    const { row } = searchParams
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
      <main className="p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue={validTab}>
          <div className="flex items-center">
            <div className="overflow-x-auto">
              <TabsList>
                {DATE_TABS.map((tab) => (
                  <Link
                    key={tab}
                    href={`/${shopId}/transaction?tab=${tab}`}
                    passHref
                  >
                    <TabsTrigger value={tab}>{t(tab)}</TabsTrigger>
                  </Link>
                ))}
              </TabsList>
            </div>
          </div>
        </Tabs>
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
      </main>

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
