import { DataTable, memberColumns } from "@/components/data-table"
import { CardDescription } from "@/components/ui/card"
import { db } from "@/db/(inv)/instance"
import { invitation, member } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils/general"
import { eq } from "drizzle-orm"

import { CopyBtn } from "@/components/button"
import { ConfirmDialog } from "@/components/dialog"
import { InvitationForm } from "@/components/form/invitation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { RoleWrapper } from "@/components/wrappers"
import { appUrl } from "@/contants/consts"
import { PlusCircleIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
type Props = {
  searchParams: Promise<{
    row?: string
    invitation?: string
    action: "delete" | "movements"
  }>
}
async function MembersPage({ searchParams }: Props) {
  const t = await getTranslations()
  const { invitation: invitationParam, action, row } = await searchParams
  const { shopId } = await getFromHeaders()
  const data = await db.query.member.findMany({
    where: eq(member.shopId, shopId),
    with: {
      user_userId: true,
      shop: true,
    },
  })

  const shareUrl = `${appUrl}/invitation/${invitationParam}`

  const deleteAction = async () => {
    "use server"
    try {
      if (!row) throw new Error("Row is required")
      await db.delete(member).where(eq(member.id, row))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Dialog>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{t("Members")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("Manage team members and invitations")}
            </p>
          </div>
          <DialogTrigger asChild>
            <Button size={"sm"}>
              <PlusCircleIcon className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only !ml-2">
                {t("Invite Member")}
              </span>
            </Button>
          </DialogTrigger>
        </div>
        <div className="mt-6">
          {/* @ts-ignore */}

          <DataTable data={data} columns={memberColumns} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("Invite member")}</DialogTitle>
              <DialogDescription>
                {t("Create an invite link and send it to your teammates")}.
              </DialogDescription>
            </DialogHeader>
            <div>
              <InvitationForm
                onSubmit={async (values) => {
                  "use server"
                  const { shopId, userId } = await getFromHeaders()
                  const [res] = await db
                    .insert(invitation)
                    .values({
                      fromShopId: shopId,
                      fromUserId: userId,
                      role: values.role,
                      updatedBy: userId,
                    })
                    .returning({
                      id: invitation.id,
                    })
                  return {
                    id: res.id,
                  }
                }}
              />
              {invitationParam && (
                <div className="mt-8">
                  <CardDescription className="my-1">
                    {t("Copy link and share it to your teammates")}.
                  </CardDescription>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input
                      id="name"
                      placeholder="Generating..."
                      className="col-span-3"
                      value={shareUrl}
                    />
                    <CopyBtn value={shareUrl} />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {action === "delete" && (
        <ConfirmDialog
          performAction={deleteAction}
          action="Remove"
          table="Members"
        />
      )}
    </>
  )
}

export default (args: Props) =>
  RoleWrapper({
    children: <MembersPage {...args} />,
    requiredRole: "ADMIN",
  })
