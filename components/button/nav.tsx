"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Messages } from "@/global"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SheetTrigger } from "../ui/sheet"

type Props = {
  href: string
  icon: React.ReactNode
  label: keyof Messages
  hideLabelOnMobile?: boolean
  renderSheetTrigger?: boolean
}

export const NavBtn = (props: Props) => {
  const { href, label, renderSheetTrigger } = props
  const t = useTranslations()
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Tooltip>
      <SheetTriggerOrEmpty show={!!renderSheetTrigger}>
        <Link
          href={href}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg py-1 transition-all hover:text-primary",
            {
              "bg-muted text-primary": isActive,
              "text-muted-foreground": !isActive,
            }
          )}
        >
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <div className="h-9 w-9 flex items-center justify-center">
                {props.icon}
              </div>
              <span
                className={cn("md:not-sr-only", {
                  "sr-only": props.hideLabelOnMobile,
                })}
              >
                {t(props.label)}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">{t(label)}</TooltipContent>
        </Link>
      </SheetTriggerOrEmpty>
    </Tooltip>
  )
}

const SheetTriggerOrEmpty = ({
  show,
  children,
}: {
  show: boolean
  children: React.ReactNode
}) => {
  return show ? (
    <SheetTrigger asChild>{children}</SheetTrigger>
  ) : (
    <>{children}</>
  )
}
