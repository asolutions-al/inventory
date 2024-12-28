"use client"

import { CheckIcon, ChevronsUpDown, LucideIcon, Trash } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

type ListItem = {
  value: string
  label: string
  icon?: LucideIcon | React.ComponentType
  rightIcon?: LucideIcon | React.ComponentType
  keywords?: string[]
}

export function Combobox({
  list,
  value,
  setValue,
  onRightIconClick,
}: {
  list: ListItem[]
  value: string
  setValue: (value: string) => void
  onRightIconClick?: (item: ListItem) => void
}) {
  const t = useTranslations()
  const [open, setOpen] = React.useState(false)

  const selected = list.find((item) => item.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex gap-2 items-center">
            {selected?.icon && <selected.icon className="h-4 w-4" />}
            {selected?.label || `${t("Select")}...`}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {list.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  keywords={[item.label, ...(item.keywords || [])]}
                  onSelect={(currentValue) => {
                    const newVal = currentValue === value ? "" : currentValue
                    setValue(newVal)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex gap-2 items-center">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </div>
                  {item.rightIcon && (
                    <div
                      className="ml-auto cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRightIconClick?.(item)
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
