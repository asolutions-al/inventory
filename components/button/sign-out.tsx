"use client"

import { ButtonProps } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { DropdownMenuItem } from "../ui/dropdown-menu"

export const SignOutBtn = ({
  text = "Sign Out",
  performAction,
  ...rest
}: {
  text?: "Sign Out"
  performAction: () => void
  rest?: ButtonProps
}) => {
  const t = useTranslations()

  return (
    <DropdownMenuItem onClick={() => performAction()} {...rest}>
      <LogOut size={15} className="mr-1" />
      {t(text)}
    </DropdownMenuItem>
  )
}
