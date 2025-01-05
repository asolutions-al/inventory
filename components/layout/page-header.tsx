import { Messages } from "@/global"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"
import { BackButton } from "../button"

const PageHeader = async ({
  title,
  className = "",
  rightComponent,
}: {
  title: keyof Messages
  formId: FormId
  className?: string
  rightComponent?: React.ReactNode
}) => {
  const t = await getTranslations()
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BackButton />
      <h1 className="font-semibold text-xl">{t(title)}</h1>
      {rightComponent}
    </div>
  )
}

export { PageHeader }
