import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SIDEBAR_ITEMS } from "@/contants/list"
import { getFromHeaders } from "@/utils/general"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"
import { NavBtn } from "../button"

export async function Sidebar() {
  const t = await getTranslations()
  const { shopId } = getFromHeaders()
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 md:w-60 flex-col border-r bg-muted/40 sm:flex">
      <div className="py-3 border-b h-14">
        <div className="flex items-center px-3">
          <Link
            href={`/${shopId}`}
            className="flex items-center gap-2 font-semibold"
          >
            <div className="min-w-6">
              <Image src="/logo.png" alt="logo" width={40} height={40} />
            </div>
            <span className="hidden md:flex">Inv</span>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="ml-auto h-9 w-9 hidden md:flex"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">{t("Toggle notifications")}</span>
          </Button>
        </div>
      </div>
      <nav className="flex flex-col items-center gap-2 sm:py-4 px-2 md:px-3">
        {SIDEBAR_ITEMS.map((item) => {
          const href = `/${shopId}${item.href}`
          return (
            <NavBtn
              key={item.label}
              href={href}
              icon={<item.icon className="h-5 w-5" />}
              label={item.label}
              hideLabelOnMobile
            />
          )
        })}
      </nav>
      <div className="mt-auto p-3">
        <Card x-chunk="dashboard-02-chunk-0" className="hidden md:block">
          <CardHeader className="p-2 pt-0 md:p-4">
            <CardTitle>{t("Upgrade to Pro")}</CardTitle>
            <CardDescription>
              {t(
                "Unlock all features and get unlimited access to our support team"
              )}
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
            <Link href={"https://www.asolutions.al/pricing"}>
              <Button size="sm" className="w-full">
                {t("Upgrade")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
