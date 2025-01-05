import { BackButton } from "@/components/button"
import { ShopCard } from "@/components/card/shop"
import { NewShopDialog } from "@/components/dialog/new-shop"
import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import { db } from "@/db/(inv)/instance"
import { member } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { eq } from "drizzle-orm"
import { PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function ShopPage() {
  const t = await getTranslations()
  const { userId } = await getFromHeaders()

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
        <NewShopDialog>
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {t("Select a shop")}
            </h1>
            <div className="md:ml-auto">
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {t("Create Shop")}
                  </span>
                </Button>
              </DialogTrigger>
            </div>
          </div>
          <div className="grid items-center sm:grid-cols-2 gap-4">
            {shopsList.map((shop) => (
              <Link href={`/${shop.id}`} key={shop.id}>
                <ShopCard data={shop} />
              </Link>
            ))}
          </div>
        </NewShopDialog>
      </div>
    </div>
  )
}
