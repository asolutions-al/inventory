/**
 * REMINDER:
 * Whenerver introspection is done, the schema file will update.
 * But for movement table, the productsDetails column will be missing types since it's a jsonb column.
 * To fix this, we need to manually add the types to the schema file.
 * Just place the below code at the chain of productDetails column in the schema file.
 * .$type<SelectProductType>()
 */

import {
  bigint,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { SelectProductType } from "../../db/(inv)/schema"

export const aal_level = pgEnum("aal_level", ["aal1", "aal2", "aal3"])
export const code_challenge_method = pgEnum("code_challenge_method", [
  "s256",
  "plain",
])
export const factor_status = pgEnum("factor_status", ["unverified", "verified"])
export const factor_type = pgEnum("factor_type", ["totp", "webauthn", "phone"])
export const one_time_token_type = pgEnum("one_time_token_type", [
  "confirmation_token",
  "reauthentication_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "phone_change_token",
])
export const key_status = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
])
export const key_type = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
])
export const PLAN = pgEnum("PLAN", ["INV-STARTER", "INV-PRO", "INV-BUSINESS"])
export const billingPeriod = pgEnum("billingPeriod", ["MONTHLY", "YEARLY"])
export const partyType = pgEnum("partyType", ["CUSTOMER", "SUPPLIER"])
export const role = pgEnum("role", ["MEMBER", "ADMIN"])
export const status = pgEnum("status", ["DRAFT", "ACTIVE", "ARCHIVED"])
export const transReason = pgEnum("transReason", [
  "PURCHASE",
  "RETURN",
  "FOUND",
  "SALE",
  "WASTE",
  "INTERNAL_USE",
  "DONATION",
  "TRANSFER",
  "ADJUSMENT",
])
export const type = pgEnum("type", ["IN", "OUT"])
export const action = pgEnum("action", [
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
  "ERROR",
])
export const equality_op = pgEnum("equality_op", [
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
])

export const party = pgTable("party", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text("name").notNull(),
  type: partyType("type").notNull(),
  status: status("status").notNull(),
})

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
})

export const member = pgTable("member", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  role: role("role").default("ADMIN").notNull(),
})

export const invitation = pgTable("invitation", {
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  fromUserId: uuid("fromUserId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  fromShopId: uuid("fromShopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  role: role("role").notNull(),
})

export const productImages = pgTable("productImages", {
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  productId: uuid("productId")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  path: text("path").notNull(),
  fullPath: text("fullPath").notNull(),
  url: text("url").notNull(),
  id: uuid("id").defaultRandom().primaryKey().notNull(),
})

export const transaction = pgTable("transaction", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  date: timestamp("date", { withTimezone: true, mode: "string" }).notNull(),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  type: type("type").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  amount: bigint("amount", { mode: "number" }).notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  reason: transReason("reason").notNull(),
})

export const user = pgTable("user", {
  id: uuid("id").primaryKey().notNull(),
  email: text("email").notNull(),
})

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  color: text("color"),
})

export const movement = pgTable("movement", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  productId: uuid("productId")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  amount: bigint("amount", { mode: "number" }).notNull(),
  type: type("type").notNull(),
  transactionId: uuid("transactionId")
    .notNull()
    .references(() => transaction.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  productDetails: jsonb("productDetails").notNull().$type<SelectProductType>(),
})

export const products = pgTable("products", {
  name: text("name").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  currentStock: bigint("currentStock", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  cost: bigint("cost", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  price: bigint("price", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  commission: bigint("commission", { mode: "number" }).notNull(),
  barcode: text("barcode"),
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  description: text("description"),
  status: status("status").notNull(),
  categoryId: uuid("categoryId").references(() => categories.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
})

export const shop = pgTable("shop", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  description: text("description"),
})

export const subscription = pgTable("subscription", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  startDate: timestamp("startDate", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  endDate: timestamp("endDate", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  plan: PLAN("plan"),
})
