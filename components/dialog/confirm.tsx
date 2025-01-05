"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Messages } from "@/global"
import { useClearSearchParams } from "@/hooks"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { PostgresError } from "postgres"
import { toast } from "sonner"

export function ConfirmDialog({
  performAction,
  action,
  table,
  extraDescription,
  onOpenChange,
}: {
  performAction: () => Promise<void>
  action: keyof Messages
  table: keyof Messages
  extraDescription?: keyof Messages
  onOpenChange?: (open: boolean) => void
}) {
  const t = useTranslations()
  const router = useRouter()
  const { path } = useClearSearchParams({ keys: ["row", "action"] })

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        onOpenChange?.(open)
        if (open) return
        // @ts-ignore
        router.push(path)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t(action)} {t(table)}
          </DialogTitle>
          <DialogDescription>
            {t("Are you sure you want to")}
            <span className="font-semibold"> {t(action)} </span>
            {t("this")}
            <span className="font-semibold"> {t(table)} </span>?
            {extraDescription && (
              <span className="block mt-3">{t(extraDescription)}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogTrigger asChild>
            <Button
              type="submit"
              onClick={async () => {
                try {
                  await performAction()
                  toast.success(`${table} ${action.toLowerCase()} success`)
                } catch (error) {
                  toast.error(
                    (error as PostgresError)?.message ||
                      "An error occurred. Please try again later."
                  )
                }
              }}
            >
              {t("Yes")}
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button variant="outline" type="button">
              {t("No")}
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
