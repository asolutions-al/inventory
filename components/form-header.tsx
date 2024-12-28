import { Messages } from "@/global"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { BackButton, FormSubmitBtns } from "./button"

const FormHeader = <T extends FieldValues>({
  title,
  form,
}: {
  title: keyof Messages
  form: UseFormReturn<T>
}) => {
  const t = (key: string) => key
  return (
    <div className="flex items-center gap-4">
      <BackButton />
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        {t(title)}
      </h1>
      <div className="ml-auto hidden sm:block">
        <FormSubmitBtns form={form} />
      </div>
    </div>
  )
}

export { FormHeader }
