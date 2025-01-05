import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getMembers } from "@/db/(inv)/loaders/member"
import { getFromHeaders } from "@/utils/general"
import { createAuthClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

type Props = {
  children: React.ReactNode
  params: Promise<{ shopId: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { shopId } = await params
  const authClient = await createAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()
  const { userId } = await getFromHeaders()
  const members = await getMembers({ userId })
  const shopsList = members.map((member) => member.shop)
  const shopIsValid = shopsList.some((shop) => shop.id === shopId)

  if (!shopIsValid) return redirect(`/shop`)

  return (
    <SidebarProvider>
      <AppSidebar members={members} user={user} />
      <main className="relative flex min-h-svh flex-1 flex-col overflow-x-auto">
        <AppHeader />
        <div className="flex-1 m-1.5 md:m-2 lg:m-2.5">{children}</div>
      </main>
    </SidebarProvider>
  )
}
