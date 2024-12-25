import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function InvitationNotFoundPage() {
  return (
    <div className="flex justify-center gap-2 items-center">
      <div className="text-center">Invitation not found</div>
      <Link href={`/`}>
        <Button>Home</Button>
      </Link>
    </div>
  )
}
