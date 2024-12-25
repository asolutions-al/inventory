import { Separator } from "@/components/ui/separator"
import { db } from "@/db/(inv)/instance"
import { shop } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { ShopForm } from "./shop-form"

export default async function SettingsShopPage() {
  const t = await getTranslations()
  const { shopId } = getFromHeaders()
  const data = await db.query.shop.findFirst({
    where: eq(shop.id, shopId),
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("Shop")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("Update your shop settings")}. {t("Manage members and more")}.
        </p>
      </div>
      <Separator />
      <ShopForm
        defaultValues={data}
        performAction={async (values) => {
          "use server"
          await db
            .update(shop)
            .set({
              ...values,
            })
            .where(eq(shop.id, shopId))
        }}
      />
    </div>
  )
}
