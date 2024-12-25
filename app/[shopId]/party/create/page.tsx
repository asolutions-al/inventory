import { PartyForm } from "@/components/form"
import { RoleWrapper } from "@/components/wrappers"
import { db } from "@/db/(inv)/instance"
import { party } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"

async function CreatePartyPage() {
  const t = await getTranslations()
  return (
    <>
      <PartyForm
        title="Create party"
        onSubmit={async (values) => {
          "use server"
          try {
            const { shopId } = getFromHeaders()

            await db.insert(party).values({
              ...values,
              shopId,
            })

            redirect(`/${shopId}/party/list`)
          } catch (error) {
            console.error(error)
            throw error
          }
        }}
      />
    </>
  )
}

export default () =>
  RoleWrapper({ children: <CreatePartyPage />, requiredRole: "ADMIN" })
