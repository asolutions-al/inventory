"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { ClipboardIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export const CopyBtn = ({
  text = "Copy",
  value,
  ...rest
}: {
  text?: "Copy"
  value: string
  rest?: ButtonProps
}) => {
  const t = useTranslations()
  return (
    <Button
      variant="outline"
      onClick={() => {
        try {
          navigator.clipboard.writeText(value)
          toast.success("Copied to clipboard")
        } catch (error) {
          toast.error("Failed to copy")
        }
      }}
      {...rest}
    >
      <ClipboardIcon size={20} />
      {t(text)}
    </Button>
  )
}
