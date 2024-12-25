import { status } from "./orm/(inv)/schema"

type DateTab =
  | "TODAY"
  | "YESTERDAY"
  | "WEEK"
  | "MONTH"
  | "QUARTER"
  | "LAST30DAYS"

type Status = (typeof status.enumValues)[number]

type TransactionTab = "IN" | "OUT"

type SParamAction = "delete" | "movements"
type SParamRow = string
