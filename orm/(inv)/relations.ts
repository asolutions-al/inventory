import { relations } from "drizzle-orm/relations"
import {
  category,
  invitation,
  member,
  movement,
  party,
  product,
  shop,
  transaction,
  user,
} from "./schema"

export const categoryRelations = relations(category, ({ one }) => ({
  shop: one(shop, {
    fields: [category.shopId],
    references: [shop.id],
  }),
  user: one(user, {
    fields: [category.updatedBy],
    references: [user.id],
  }),
}))

export const shopRelations = relations(shop, ({ one, many }) => ({
  categories: many(category),
  parties: many(party),
  invitations: many(invitation),
  user: one(user, {
    fields: [shop.updatedBy],
    references: [user.id],
  }),
  transactions: many(transaction),
  movements: many(movement),
  members: many(member),
  products: many(product),
}))

export const userRelations = relations(user, ({ one, many }) => ({
  categories: many(category),
  parties: many(party),
  invitations_fromUserId: many(invitation, {
    relationName: "invitation_fromUserId_user_id",
  }),
  invitations_updatedBy: many(invitation, {
    relationName: "invitation_updatedBy_user_id",
  }),
  shops: many(shop),
  transactions: many(transaction),
  user: one(user, {
    fields: [user.updatedBy],
    references: [user.id],
    relationName: "user_updatedBy_user_id",
  }),
  users: many(user, {
    relationName: "user_updatedBy_user_id",
  }),
  movements: many(movement),
  members_updatedBy: many(member, {
    relationName: "member_updatedBy_user_id",
  }),
  members_userId: many(member, {
    relationName: "member_userId_user_id",
  }),
  products: many(product),
}))

export const partyRelations = relations(party, ({ one }) => ({
  shop: one(shop, {
    fields: [party.shopId],
    references: [shop.id],
  }),
  user: one(user, {
    fields: [party.updatedBy],
    references: [user.id],
  }),
}))

export const invitationRelations = relations(invitation, ({ one }) => ({
  shop: one(shop, {
    fields: [invitation.fromShopId],
    references: [shop.id],
  }),
  user_fromUserId: one(user, {
    fields: [invitation.fromUserId],
    references: [user.id],
    relationName: "invitation_fromUserId_user_id",
  }),
  user_updatedBy: one(user, {
    fields: [invitation.updatedBy],
    references: [user.id],
    relationName: "invitation_updatedBy_user_id",
  }),
}))

export const transactionRelations = relations(transaction, ({ one, many }) => ({
  shop: one(shop, {
    fields: [transaction.shopId],
    references: [shop.id],
  }),
  user: one(user, {
    fields: [transaction.updatedBy],
    references: [user.id],
  }),
  movements: many(movement),
}))

export const movementRelations = relations(movement, ({ one }) => ({
  product: one(product, {
    fields: [movement.productId],
    references: [product.id],
  }),
  shop: one(shop, {
    fields: [movement.shopId],
    references: [shop.id],
  }),
  transaction: one(transaction, {
    fields: [movement.transactionId],
    references: [transaction.id],
  }),
  user: one(user, {
    fields: [movement.updatedBy],
    references: [user.id],
  }),
}))

export const productRelations = relations(product, ({ one, many }) => ({
  movements: many(movement),
  shop: one(shop, {
    fields: [product.shopId],
    references: [shop.id],
  }),
  user: one(user, {
    fields: [product.updatedBy],
    references: [user.id],
  }),
}))

export const memberRelations = relations(member, ({ one }) => ({
  shop: one(shop, {
    fields: [member.shopId],
    references: [shop.id],
  }),
  user_updatedBy: one(user, {
    fields: [member.updatedBy],
    references: [user.id],
    relationName: "member_updatedBy_user_id",
  }),
  user_userId: one(user, {
    fields: [member.userId],
    references: [user.id],
    relationName: "member_userId_user_id",
  }),
}))
