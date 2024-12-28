import { PartyForm } from "@/components/form"
import { RoleWrapper } from "@/components/wrappers"
import { db } from "@/db/(inv)/instance"
import { party } from "@/orm/(inv)/schema"
import { getFromHeaders } from "@/utils"
import { eq } from "drizzle-orm"
import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"

type Props = {
  params: Promise<{
    shopId: string
    id: string
  }>
}

async function UpdatePartyPage(props: Props) {
  const t = await getTranslations()
  const { id } = (await props.params) || {}

  const data = await db.query.party.findFirst({
    where: eq(party.id, id),
  })

  return (
    <>
      <PartyForm
        title="Update party"
        defaultValues={data}
        onSubmit={async (values) => {
          "use server"
          try {
            const { shopId } = await getFromHeaders()

            await db.update(party).set(values).where(eq(party.id, id))

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

export default (props: Props) =>
  RoleWrapper({
    children: <UpdatePartyPage {...props} />,
    requiredRole: "ADMIN",
  })
