import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getFromHeaders } from "@/utils"
import { User } from "@supabase/supabase-js"
import { HeadphonesIcon, SettingsIcon, UserIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { SignOutBtn } from "./button"
import { RoleWrapper } from "./wrappers"

export default async function AuthButton({
  signOut,
  user,
}: {
  signOut: () => void
  user: User | null
}) {
  const { shopId } = getFromHeaders()
  const t = await getTranslations()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <RoleWrapper requiredRole="ADMIN">
          <Link href={`/${shopId}/settings`}>
            <DropdownMenuItem>
              <SettingsIcon size={15} className="mr-1" />
              {t("Settings")}
            </DropdownMenuItem>
          </Link>
        </RoleWrapper>
        <DropdownMenuItem>
          <HeadphonesIcon size={15} className="mr-1" />
          {t("Support")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutBtn performAction={signOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
