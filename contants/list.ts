import { Messages } from "@/global"
import { DateTab } from "@/types"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Home,
  LucideProps,
  Package,
  ReceiptText,
} from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export const SIDEBAR_ITEMS: {
  label: keyof Messages
  href: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
}[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "",
  },
  {
    icon: Package,
    label: "Products",
    href: "/product",
  },

  {
    icon: ArrowUp,
    label: "In",
    href: "/in/create",
  },
  {
    icon: ArrowDown,
    label: "Out",
    href: "/out/create",
  },
  {
    icon: ArrowUpDown,
    label: "Movement",
    href: "/movement/list",
  },
  {
    icon: ReceiptText,
    label: "Transaction",
    href: "/transaction/list",
  },
]

export const SETTING_ITEMS: {
  text: "General" | "Members"
  // | "Security"
  // | "Integrations"
  // | "Support"
  // | "Organizations"
  // | "Advanced";
  href: string
}[] = [
  {
    text: "General",
    href: "",
  },
  {
    text: "Members",
    href: "/members",
  },
  // {
  //   text: "Security",
  //   href: "#",
  // },
  // {
  //   text: "Integrations",
  //   href: "#",
  // },
  // {
  //   text: "Support",
  //   href: "#",
  // },
  // {
  //   text: "Organizations",
  //   href: "#",
  // },
  // {
  //   text: "Advanced",
  //   href: "#",
  // },
]

export const DATE_TABS: DateTab[] = [
  "TODAY",
  "YESTERDAY",
  "WEEK",
  "MONTH",
  "QUARTER",
]
