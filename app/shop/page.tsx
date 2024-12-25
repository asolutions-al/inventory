import { ShopCard } from "@/components/card/shop"
import { NewShopDialogContent } from "@/components/dialog/new-shop"
import { ShopPageHeader } from "@/components/layout/page-header/shop"
import { Dialog } from "@/components/ui/dialog"
import { db } from "@/db/(inv)/instance"
import { member } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function ShopPage() {
  const t = await getTranslations()
  const { userId } = getFromHeaders()

  const members = await db.query.member.findMany({
    where: eq(member.userId, userId),
    with: {
      shop: true,
    },
  })
  const shopsList = members.map((member) => member.shop)
  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 max-w-4xl p-2 mx-auto">
        <Dialog>
          <ShopPageHeader />
          <div className="grid items-center sm:grid-cols-2 gap-4">
            {shopsList.map((shop) => (
              <Link href={`/${shop.id}`} key={shop.id}>
                <ShopCard data={shop} />
              </Link>
            ))}
            <NewShopDialogContent />
          </div>
        </Dialog>
      </div>
    </div>
  )
}
