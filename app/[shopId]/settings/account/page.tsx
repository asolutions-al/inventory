import { Separator } from "@/components/ui/separator"
import { db } from "@/db/(inv)/instance"
import { user } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { AccountForm } from "../account-form"

export default async function SettingsAccountPage() {
  const t = await getTranslations()
  const { userId } = await getFromHeaders()

  const data = await db.query.user.findFirst({
    where: eq(user.id, userId),
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("Account")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("Update your account settings")}.
        </p>
      </div>
      <Separator />
      <AccountForm defaultValues={data} />
    </div>
  )
}
