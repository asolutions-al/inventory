"use client"

import { BackButton } from "@/components/button/back"
import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { PlusCircle } from "lucide-react"

export function ShopPageHeader() {
  const t = (key: string) => key

  return (
    <>
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {t("Select a shop")}
        </h1>
        <div className="md:ml-auto">
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {t("Create Shop")}
              </span>
            </Button>
          </DialogTrigger>
        </div>
      </div>
    </>
  )
}
