import { CheckIcon, Eraser } from "lucide-react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { Button } from "../ui/button"

const FormSubmitBtns = <T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>
}) => {
  const t = (key: string) => key
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
      <Button size="sm" type="submit">
        <CheckIcon size={15} className="mr-1" />
        {t("Save")}
      </Button>
    </div>
  )
}

export { FormSubmitBtns }
