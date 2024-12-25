"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { locales } from "@/i18n"
import { useLocale, useTranslations } from "next-intl"

export function LanguageSwitcher() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <Select defaultValue={locale}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {locales.map((locale) => (
            <SelectItem key={locale} value={locale}>
              {t(locale)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
