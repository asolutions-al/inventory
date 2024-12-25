import { createShop } from "@/db/(inv)/actions/shop"
import { useTranslations } from "next-intl"
import { ShopForm } from "../form/shop"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

const NewShopDialogContent = () => {
  const t = useTranslations()
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{t("Create shop")}</DialogTitle>
        <DialogDescription>
          {t("Fill in the form below to create a new shop")}
        </DialogDescription>
      </DialogHeader>
      <ShopForm onSubmit={createShop} />
    </DialogContent>
  )
}

export { NewShopDialogContent }
