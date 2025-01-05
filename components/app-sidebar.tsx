"use client"

import { BookOpen, Bot, Package, Settings2, UserIcon } from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { ShopSwitcher } from "@/components/shop-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SelectMemberType, SelectShopType } from "@/db/(inv)/schema"
import { useGetShopId } from "@/hooks"
import { User } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  members: (SelectMemberType & {
    shop: SelectShopType
  })[]
  user: User | null
}) {
  const t = useTranslations()
  const shopsList = props.members.map((member) => member.shop)
  const shopId = useGetShopId()

  const data = {
    user: {
      name: props.user?.email!,
      email: props.user?.email!,
      avatar: "",
    },
    teams: shopsList,
    navMain: [
      {
        title: t("Inventory"),
        url: "#",
        icon: Bot,
        isActive: true,
        items: [
          {
            title: t("In"),
            url: `/${shopId}/in/create`,
          },
          {
            title: t("Out"),
            url: `/${shopId}/out/create`,
          },
        ],
      },
      {
        title: t("History"),
        url: "#",
        icon: BookOpen,
        isActive: true,
        items: [
          {
            title: t("Dashboard"),
            url: `/${shopId}`,
          },
          {
            title: t("Movements"),
            url: `/${shopId}/movement/list`,
          },
          {
            title: t("Transactions"),
            url: `/${shopId}/transaction/list`,
          },
        ],
      },
      {
        title: t("Product"),
        url: "#",
        icon: Package,
        items: [
          {
            title: t("List"),
            url: `/${shopId}/product/list`,
          },
          {
            title: t("Create"),
            url: `/${shopId}/product/create`,
          },
        ],
      },
      {
        title: t("Party"),
        url: "#",
        icon: UserIcon,
        items: [
          {
            title: t("List"),
            url: `/${shopId}/party/list`,
          },
          {
            title: t("Create"),
            url: `/${shopId}/party/create`,
          },
        ],
      },

      // {
      //   title: "Documentation",
      //   url: "#",
      //   icon: BookOpen,
      //   items: [
      //     {
      //       title: "Introduction",
      //       url: "#",
      //     },
      //     {
      //       title: "Get Started",
      //       url: "#",
      //     },
      //     {
      //       title: "Tutorials",
      //       url: "#",
      //     },
      //     {
      //       title: "Changelog",
      //       url: "#",
      //     },
      //   ],
      // },
      {
        title: t("Settings"),
        url: "#",
        icon: Settings2,
        items: [
          {
            title: t("Account"),
            url: `/${shopId}/settings`,
          },
          {
            title: t("Shop"),
            url: `/${shopId}/settings/shop`,
          },
          {
            title: t("Members"),
            url: `/${shopId}/settings/members`,
          },
          {
            title: t("Appearance"),
            url: `/${shopId}/settings/appearance`,
          },
        ],
      },
    ],
    // projects: [
    //   {
    //     name: "Design Engineering",
    //     url: "#",
    //     icon: Frame,
    //   },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
    // ],
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ShopSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
