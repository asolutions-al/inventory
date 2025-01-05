import {
  FiveMostSoldProductsChart,
  FiveMostSoldProductsChartProps,
  MembersPerformanceChart,
  MembersPerformanceChartProps,
} from "@/components/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DATE_TABS } from "@/contants/list"
import { db } from "@/db/(inv)/instance"
import { useDateTabs } from "@/hooks"
import { getMember } from "@/lib/supabase"
import { movement } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { and, eq, gte, lte } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type Props = {
  searchParams: Promise<{ tab?: string }>
}

export default async function ShopDashboardPage({ searchParams }: Props) {
  const { tab } = await searchParams
  const t = await getTranslations()
  const { validTab, start, end } = useDateTabs({ tabParam: tab })
  const { shopId, userId } = await getFromHeaders()

  const { role } = (await getMember()) || {}

  const qry = [
    eq(movement.shopId, shopId),
    gte(movement.createdAt, start.toISOString()),
    lte(movement.createdAt, end.toISOString()),
  ]

  if (role !== "ADMIN") qry.push(eq(movement.updatedBy, userId))

  const movements = await db.query.movement.findMany({
    where: and(...qry),
    with: {
      transaction: true,
      user: true,
    },
  })

  const outMovements = movements.filter((movement) => movement.type === "OUT")

  const membersPerformance = movements.reduce<
    MembersPerformanceChartProps["data"]
  >((acc, curr) => {
    const existing = acc.find((data) => data.user === curr.user.email) // email is unique
    if (existing) {
      if (curr.type === "IN") existing.in += curr.amount
      if (curr.type === "OUT") {
        existing.out += curr.amount
        // @ts-ignore
        existing.commission += curr.productDetails.commission * curr.amount
      }

      return acc
    }
    acc.push({
      user: curr.user.email,
      in: curr.type === "IN" ? curr.amount : 0,
      out: curr.type === "OUT" ? curr.amount : 0,
      commission:
        // @ts-ignore

        curr.type === "OUT" ? curr.productDetails.commission * curr.amount : 0,
    })
    return acc
  }, [])

  const fiveMostSoldProducts = outMovements
    .filter((movement) => movement.transaction.reason === "SALE")
    .reduce<FiveMostSoldProductsChartProps["data"]>((acc, curr) => {
      // @ts-ignore
      const existing = acc.find((data) => data.id === curr.productDetails.id)
      if (existing) {
        existing.quantity += curr.amount
        return acc
      }
      acc.push({
        // @ts-ignore
        id: curr.productDetails.id,
        // @ts-ignore
        label: curr.productDetails.name,
        quantity: curr.amount,
      })
      return acc
    }, [])

  return (
    <>
      <div className="px-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="mt-3">
          <Tabs defaultValue={validTab}>
            <TabsList>
              {DATE_TABS.map((tab) => (
                // @ts-ignore
                <Link key={tab} href={`${shopId}?tab=${tab}`} passHref>
                  <TabsTrigger value={tab}>{t(tab)}</TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 m-2">
        <FiveMostSoldProductsChart data={fiveMostSoldProducts} />
        <MembersPerformanceChart data={membersPerformance} />
      </div>
    </>
  )
}

// export default (args: Args) =>
//   RoleWrapper({
//     children: <ShopDashboardPage {...args} />,
//     requiredRole: "ADMIN",
//   });
