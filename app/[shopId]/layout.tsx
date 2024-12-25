import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { db } from "@/db/(inv)/instance"
import { member } from "@/orm/(inv)/schema"
import { StoreProvider } from "@/providers/store-provider"
import { getFromHeaders } from "@/utils/general"
import { createAuthClient } from "@/utils/supabase/server"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

type Args = {
  children: React.ReactNode
  params: { shopId: string }
}

export default async function RootLayout({
  children,
  params: { shopId },
}: Args) {
  const authClient = createAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  const { userId } = getFromHeaders()
  const members = await db.query.member.findMany({
    where: eq(member.userId, userId),
    with: {
      shop: true,
    },
  })

  const shopsList = members.map((member) => member.shop)
  const shopIsValid = shopsList.some((shop) => shop.id === shopId)

  if (!shopIsValid) return redirect(`/shop`)

  const memberData = members.find((member) => member.shopId === shopId)

  return (
    <StoreProvider
      initState={{
        role: memberData?.role || "MEMBER",
      }}
    >
      <SidebarProvider>
        <AppSidebar members={members} user={user} />
        <main className="relative flex min-h-svh flex-1 flex-col overflow-x-auto">
          <AppHeader />
          <div className="mt-3 mx-1.5 md:mx-3">{children}</div>
        </main>
      </SidebarProvider>
    </StoreProvider>
  )
}
