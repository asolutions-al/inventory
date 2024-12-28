"use client"

import { AudioWaveformIcon, ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SelectShopType } from "@/db/(inv)/schema"
import { useParams } from "next/navigation"
import { NewShopDialog } from "./dialog/new-shop"
import { DialogTrigger } from "./ui/dialog"

export function ShopSwitcher({ teams }: { teams: SelectShopType[] }) {
  const t = (key: string) => key
  const { isMobile } = useSidebar()
  const params = useParams<{ shopId: string }>()
  const activeTeam = teams.find((team) => team.id === params.shopId)!

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <NewShopDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <AudioWaveformIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeTeam.description}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("Shops")}
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem key={team.name} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <AudioWaveformIcon className="size-4 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />

              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    {t("Add shop")}
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </NewShopDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
