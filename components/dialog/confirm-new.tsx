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
import { Check, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { ReactNode } from "react"
import { toast } from "sonner"

export function ConfirmDialogNew({
  onConfirm,
  title,
  description,
  children,
}: {
  description: keyof Messages
  onConfirm: () => Promise<void>
  title: keyof Messages
  children: ReactNode
}) {
  const t = useTranslations()

  return (
    <Dialog>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription>{t(description)}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogTrigger asChild>
            <Button variant="outline" type="button">
              <X />
              {t("No")}
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={async () => {
                try {
                  await onConfirm()
                  toast.success(t("Action completed successfully"))
                } catch (error) {
                  toast.error(t("An error occurred"))
                }
              }}
            >
              <Check />
              {t("Yes")}
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
