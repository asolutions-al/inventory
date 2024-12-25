import { relations } from "drizzle-orm/relations";
import { shop, party, member, user, invitation, products, productImages, transaction, categories, movement, subscription } from "./schema";

export const partyRelations = relations(party, ({one}) => ({
	shop: one(shop, {
		fields: [party.shopId],
		references: [shop.id]
	}),
}));

export const shopRelations = relations(shop, ({one, many}) => ({
	parties: many(party),
	members: many(member),
	invitations: many(invitation),
	transactions: many(transaction),
	categories: many(categories),
	movements: many(movement),
	products: many(products),
	user: one(user, {
		fields: [shop.userId],
		references: [user.id]
	}),
	subscriptions: many(subscription),
}));

export const memberRelations = relations(member, ({one}) => ({
	shop: one(shop, {
		fields: [member.shopId],
		references: [shop.id]
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	members: many(member),
	invitations: many(invitation),
	transactions: many(transaction),
	movements: many(movement),
	products: many(products),
	shops: many(shop),
}));

export const invitationRelations = relations(invitation, ({one}) => ({
	shop: one(shop, {
		fields: [invitation.fromShopId],
		references: [shop.id]
	}),
	user: one(user, {
		fields: [invitation.fromUserId],
		references: [user.id]
	}),
}));

export const productImagesRelations = relations(productImages, ({one}) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	productImages: many(productImages),
	movements: many(movement),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	shop: one(shop, {
		fields: [products.shopId],
		references: [shop.id]
	}),
	user: one(user, {
		fields: [products.userId],
		references: [user.id]
	}),
}));

export const transactionRelations = relations(transaction, ({one, many}) => ({
	shop: one(shop, {
		fields: [transaction.shopId],
		references: [shop.id]
	}),
	user: one(user, {
		fields: [transaction.userId],
		references: [user.id]
	}),
	movements: many(movement),
}));

export const categoriesRelations = relations(categories, ({one, many}) => ({
	shop: one(shop, {
		fields: [categories.shopId],
		references: [shop.id]
	}),
	products: many(products),
}));

export const movementRelations = relations(movement, ({one}) => ({
	product: one(products, {
		fields: [movement.productId],
		references: [products.id]
	}),
	shop: one(shop, {
		fields: [movement.shopId],
		references: [shop.id]
	}),
	transaction: one(transaction, {
		fields: [movement.transactionId],
		references: [transaction.id]
	}),
	user: one(user, {
		fields: [movement.userId],
		references: [user.id]
	}),
}));

export const subscriptionRelations = relations(subscription, ({one}) => ({
	shop: one(shop, {
		fields: [subscription.shopId],
		references: [shop.id]
	}),
}));