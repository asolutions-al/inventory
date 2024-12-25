import { PanelLeft, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SIDEBAR_ITEMS } from "@/contants/list"
import { db } from "@/db/(inv)/instance"
import { member } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { getAuthUrl } from "@/utils/supabase/auth"
import { createAuthClient } from "@/utils/supabase/server"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import AuthButton from "../AuthButton"
import { NavBtn } from "../button"
import { ShopCombobox } from "../combobox"

export async function Navbar() {
  const t = await getTranslations()
  const client = createAuthClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  const { shopId, userId } = getFromHeaders()
  const members = await db.query.member.findMany({
    where: eq(member.userId, userId),
    with: {
      shop: true,
    },
  })

  const shopsList = members.map((member) => member.shop)

  const signOut = async () => {
    "use server"

    const client = createAuthClient()
    await client.auth.signOut()

    redirect(getAuthUrl())
  }

  return (
    <header className="z-10 sticky top-0 backdrop-blur h-14 border-b bg-muted/40 py-3 px-4 sm:px-6 flex items-center gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="max-w-xs">
          <nav className="grid gap-2 text-lg font-medium">
            {SIDEBAR_ITEMS.map((item) => {
              const href = `/${shopId}${item.href}`
              return (
                <NavBtn
                  key={item.label}
                  href={href}
                  icon={<item.icon className="h-5 w-5" />}
                  label={item.label}
                  renderSheetTrigger
                />
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex gap-2">
        <Link href={`/${shopId}`} className="flex items-center sm:hidden">
          <div className="min-w-8">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
          </div>
          <h2 className="text-2xl font-semibold hidden sm:flex">Inv</h2>
        </Link>
        <ShopCombobox
          list={shopsList.map((shop) => ({ value: shop.id, label: shop.name }))}
        />
      </div>
      <div className="relative ml-auto flex-1 md:grow-0">
        <div className="hidden sm:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`${t("Search")}...`}
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </div>
      <AuthButton signOut={signOut} user={user} />
    </header>
  )
}
