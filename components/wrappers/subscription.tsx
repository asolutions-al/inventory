import { SelectPlanType } from "@/db/(auth)/schema"
import { getSubscription } from "@/modules/subscription"

export const SubscriptionWrapper = async ({
  children,
  required,
}: {
  children: React.ReactNode
  required: SelectPlanType["id"] // TODO: replace with subscription plan type
}) => {
  const res = await getSubscription()

  if (res?.plan !== required) return null

  return <>{children}</>
}
