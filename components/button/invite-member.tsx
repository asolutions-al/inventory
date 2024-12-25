"use client"

import { role } from "@/orm/(inv)/schema"
import { PlusCircleIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"

export function InviteMember({
  performAction,
}: {
  performAction: () => Promise<{
    id: string
  }>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  return (
    <Button
      onClick={async () => {
        const res = await performAction()
        const updatedSearchParams = new URLSearchParams(searchParams)
        updatedSearchParams.set("invitation", res.id)
        updatedSearchParams.set("role", role.enumValues[0])
        router.push(`${pathname}?${updatedSearchParams.toString()}`)
      }}
    >
      <PlusCircleIcon className="w-4 h-4 mr-2" />
      Invite Member
    </Button>
  )
}
