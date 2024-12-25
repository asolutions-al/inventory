import {
  categories,
  invitation,
  member,
  movement,
  party,
  productImages,
  products,
  role,
  shop,
  transaction,
  user,
} from "@/orm/(inv)/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const selectProductSchema = createSelectSchema(products)
export type SelectProductType = z.infer<typeof selectProductSchema>
export type SelectProductTypeWithCategory = SelectProductType & {
  category: SelectCategoryType | null
}

export const insertProductFormSchema = createInsertSchema(products, {
  name: (sch) => sch.name.min(1),
}).omit({
  shopId: true,
  userId: true,
})
export type InsertProductFormType = z.infer<typeof insertProductFormSchema>

export const insertMovementFormSchema = createInsertSchema(movement, {
  amount: (sch) => sch.amount.positive(),
})
export type InsertMovementFormType = z.infer<typeof insertMovementFormSchema>
export const selectMovementSchema = createSelectSchema(movement)
export type SelectMovementType = z.infer<typeof selectMovementSchema>
export type SelectMovementTypeWithUser = SelectMovementType & {
  user: SelectUserType
}

export const insertTransactionSchema = createInsertSchema(transaction)
export const insertTransactionFormSchema = createInsertSchema(transaction, {
  date: z.date(),
}).omit({
  shopId: true,
  userId: true,
  type: true,
  amount: true,
})
export const selectTransactionSchema = createSelectSchema(transaction)
export type SelectTransactionType = z.infer<typeof selectTransactionSchema>

export const insertShopSchema = createInsertSchema(shop)

export const selectShopSchema = createSelectSchema(shop)
export type SelectShopType = z.infer<typeof selectShopSchema>
export const insertFormShopSchema = createInsertSchema(shop, {
  name: (sch) => sch.name.min(1),
}).omit({
  userId: true,
})
export type InsertFormShopType = z.infer<typeof insertFormShopSchema>
export type InsertShopType = z.infer<typeof insertShopSchema>

export const selectMemberSchema = createSelectSchema(member)
export type SelectMemberType = z.infer<typeof selectMemberSchema>
export type SelectMemberTypeWithShopUser = SelectMemberType & {
  shop: SelectShopType
  user: SelectUserType
}

export const selectUserSchema = createSelectSchema(user)
export const insertUserFormSchema = createInsertSchema(user, {
  email: (sch) => sch.email.min(1),
})
export type SelectUserType = z.infer<typeof selectUserSchema>
export type InsertUserFormType = z.infer<typeof insertUserFormSchema>

export const insertInvitationFormSchema = createInsertSchema(invitation).omit({
  fromShopId: true,
  fromUserId: true,
})
export type InsertInvitationFormType = z.infer<
  typeof insertInvitationFormSchema
>
export const selectInvitationSchema = createSelectSchema(invitation)
export type SelectInvitationType = z.infer<typeof selectInvitationSchema>
export type SelectInvitationTypeWithShopUser = SelectInvitationType & {
  shop: SelectShopType
  user: SelectUserType
}

export type Role = (typeof role.enumValues)[number] //TODO: does this belong here?

export const insertCategoryFormSchema = createInsertSchema(categories, {
  name: (sch) => sch.name.min(1),
}).omit({
  shopId: true,
})
export type InsertCategoryFormType = z.infer<typeof insertCategoryFormSchema>
export const selectCategorySchema = createSelectSchema(categories)
export type SelectCategoryType = z.infer<typeof selectCategorySchema>

export const categoriesSchema = createSelectSchema(categories)
export type SelectCategoriesType = z.infer<typeof categoriesSchema>

export const selectProductImagesSchema = createSelectSchema(productImages)
export type SelectProductImagesType = z.infer<typeof selectProductImagesSchema>

const partySelectSchema = createSelectSchema(party)
export type PartySelectSchema = z.infer<typeof partySelectSchema>
export const partyFormSchema = createInsertSchema(party, {
  name: (sch) => sch.name.min(1),
}).omit({
  shopId: true,
  created_at: true,
  id: true,
})
export type PartyFormSchema = z.infer<typeof partyFormSchema>
