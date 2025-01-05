import { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { Messages } from "@/global"
import { getTranslations } from "next-intl/server"
import { SidebarNav } from "./sidebar-nav"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems: {
  title: keyof Messages
  href: string
}[] = [
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "Shop",
    href: "/settings/shop",
  },
  {
    title: "Members",
    href: "/settings/members",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
  //TODO: Implement these pages in the future
  //   {
  //     title: "Notifications",
  //     href: "/settings/notifications",
  //   },
  //   {
  //     title: "Display",
  //     href: "/settings/display",
  //   },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const t = await getTranslations()
  return (
    <>
      <div className="space-y-6 px-6 pb-16 pt-6 sm:pt-0 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{t("Settings")}</h2>
          <p className="text-muted-foreground">
            {t("Manage your account and shop settings")}.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}
