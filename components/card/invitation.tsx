import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SelectInvitationTypeWithShopUser } from "@/db/(inv)/schema"
import { CheckCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Button } from "../ui/button"

export async function InvitationCard({
  data,
  href,
}: {
  data: SelectInvitationTypeWithShopUser
  href: string
}) {
  const t = await getTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Join")} "{data.shop.name}"
        </CardTitle>
        <h2 className="text-lg">
          {data.user.email} {t("invited you to join as a", { role: data.role })}
          .
        </h2>
        <CardDescription>
          *
          {t(
            "If you are not a Inv user yet, please accept the invite and make youraccount to join the shop"
          )}
          .
        </CardDescription>

        <Link href={href}>
          <Button>
            <CheckCircle className="w-4 h-4 mr-2" />
            {t("Accept")}
          </Button>
        </Link>
      </CardHeader>
    </Card>
  )
}
