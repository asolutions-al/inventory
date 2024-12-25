import { Separator } from "@/components/ui/separator"
import { getTranslations } from "next-intl/server"
import { AppearanceForm } from "./appearance-form"

export default async function SettingsAppearancePage() {
  const t = await getTranslations()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("Appearance")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("Customize the appearance of the app")}.
          {t("Automatically switch between day and night themes")}
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  )
}
