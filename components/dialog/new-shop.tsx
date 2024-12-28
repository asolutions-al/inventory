"use client"

import { createShop } from "@/db/(inv)/actions/shop"
import { PropsWithChildren, useState } from "react"
import { ShopForm } from "../form/shop"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

const NewShopDialog = ({ children }: PropsWithChildren) => {
  const t = (key: string) => key
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Create shop")}</DialogTitle>
          <DialogDescription>
            {t("Fill in the form below to create a new shop")}
          </DialogDescription>
        </DialogHeader>
        <ShopForm performAction={createShop} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export { NewShopDialog }
