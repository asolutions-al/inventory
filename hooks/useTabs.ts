import { DATE_TABS } from "@/contants/list"
import { TAB_START_END } from "@/contants/maps"
import { status } from "@/orm/(inv)/schema"

export const useDateTabs = ({ tabParam }: { tabParam?: string }) => {
  const validTab: DateTab =
    tabParam && DATE_TABS.includes(tabParam as DateTab)
      ? (tabParam as DateTab)
      : "TODAY"
  const { getStart, getEnd } = TAB_START_END[validTab]
  const start = getStart()
  const end = getEnd()

  return { start, end, validTab }
}

export const useStatusTabs = ({ tabParam }: { tabParam?: string }) => {
  const validTab: (typeof status.enumValues)[number] =
    tabParam &&
    status.enumValues.includes(tabParam as (typeof status.enumValues)[number])
      ? (tabParam as (typeof status.enumValues)[number])
      : "ACTIVE"

  return { validTab }
}
