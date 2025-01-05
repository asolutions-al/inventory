import {
  category,
  invitation,
  member,
  movement,
  party,
  product,
  role,
  shop,
  transaction,
  user,
} from "@/orm/(inv)/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

/////////////PRODUCT/////////////////////
export const productSchema = createSelectSchema(product)
export type ProductSchemaT = z.infer<typeof productSchema>

/////////////TRANSACTION/////////////////////
export const transactionSchema = createSelectSchema(transaction)
export type TransactionSchemaT = z.infer<typeof transactionSchema>

/////////////MOVEMENT/////////////////////
export const movementSchema = createSelectSchema(movement)
export type MovementSchemaT = z.infer<typeof movementSchema>
export type MovementWUserSchemaT = MovementSchemaT & {
  user: SelectUserType
}
// TODO: migrate below insert sceham into form provider
/////////////SHOP/////////////////////
export const insertShopSchema = createInsertSchema(shop)
export const selectShopSchema = createSelectSchema(shop)
export type SelectShopType = z.infer<typeof selectShopSchema>
export const insertFormShopSchema = createInsertSchema(shop, {
  name: (sch) => sch.name.min(1),
}).omit({
  updatedBy: true,
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
  updatedBy: true,
})
export type InsertInvitationFormType = z.infer<
  typeof insertInvitationFormSchema
>
export const selectInvitationSchema = createSelectSchema(invitation)
export type SelectInvitationType = z.infer<typeof selectInvitationSchema>
export type SelectInvitationTypeWithShopUser = SelectInvitationType & {
  shop: SelectShopType
  user_fromUserId: SelectUserType
}

export type Role = (typeof role.enumValues)[number] //TODO: does this belong here?

export const insertCategoryFormSchema = createInsertSchema(category, {
  name: (sch) => sch.name.min(1),
}).omit({
  shopId: true,
})
export type InsertCategoryFormType = z.infer<typeof insertCategoryFormSchema>
export const selectCategorySchema = createSelectSchema(category)
export type SelectCategoryType = z.infer<typeof selectCategorySchema>

export const categoriesSchema = createSelectSchema(category)
export type SelectCategoriesType = z.infer<typeof categoriesSchema>

export const selectProductImagesSchema = createSelectSchema(product) //TODO:
export type SelectProductImagesType = z.infer<typeof selectProductImagesSchema>

const partySelectSchema = createSelectSchema(party)
export type PartySelectSchema = z.infer<typeof partySelectSchema>
export const partyFormSchema = createInsertSchema(party, {
  name: (sch) => sch.name.min(1),
}).omit({
  shopId: true,
  createdAt: true,
  id: true,
  updatedBy: true,
})
export type PartyFormSchema = z.infer<typeof partyFormSchema>
