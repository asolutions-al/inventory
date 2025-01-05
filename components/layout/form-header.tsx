"use client"

import { Messages } from "@/global"
import { cn } from "@/lib/utils"
import { CheckIcon, Eraser } from "lucide-react"
import { useTranslations } from "next-intl"
import { FieldValues, useFormContext, UseFormReturn } from "react-hook-form"
import { BackButton } from "../button"
import { Button } from "../ui/button"

const ActionBtns = <T extends FieldValues>({
  form,
  formId,
}: {
  form: UseFormReturn<T>
  formId: FormId
}) => {
  const t = useTranslations()
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => form.reset()}
      >
        <Eraser size={15} className="mr-1" />
        {t("Discard")}
      </Button>
      <Button size="sm" type="submit" form={formId}>
        <CheckIcon size={15} className="mr-1" />
        {t("Save")}
      </Button>
    </div>
  )
}

const FormHeader = ({
  title,
  formId,
  className = "",
}: {
  title: keyof Messages
  formId: FormId
  className?: string
}) => {
  const t = useTranslations()
  const form = useFormContext()
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <BackButton />
      <h1 className="font-semibold text-xl">{t(title)}</h1>
      <div className="ml-auto hidden sm:block">
        <ActionBtns form={form} formId={formId} />
      </div>
    </div>
  )
}

export { FormHeader }
