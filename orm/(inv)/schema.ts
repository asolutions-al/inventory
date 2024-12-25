import {
  bigint,
  foreignKey,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

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
export const party_type = pgEnum("party_type", ["CUSTOMER", "SUPPLIER"])
export const role = pgEnum("role", ["ADMIN", "MEMBER"])
export const status = pgEnum("status", ["DRAFT", "ACTIVE", "ARCHIVED"])
export const transaction_reason = pgEnum("transaction_reason", [
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
export const transaction_type = pgEnum("transaction_type", ["IN", "OUT"])
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

export const category = pgTable("category", {
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updatedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull(),
  id: uuid("id").defaultRandom().primaryKey().notNull(),
})

export const party = pgTable("party", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updatedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text("name").notNull(),
  status: status("status").notNull(),
  type: party_type("type").notNull(),
})

export const invitation = pgTable("invitation", {
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updatedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  fromUserId: uuid("fromUserId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  fromShopId: uuid("fromShopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  role: role("role").notNull(),
  id: uuid("id").defaultRandom().primaryKey().notNull(),
})

export const shop = pgTable("shop", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updatedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
})

export const transaction = pgTable("transaction", {
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updatedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  date: timestamp("date", { withTimezone: true, mode: "string" }).notNull(),
  type: transaction_type("type").notNull(),
  reason: transaction_reason("reason").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  amount: bigint("amount", { mode: "number" }).notNull(),
  id: uuid("id").defaultRandom().primaryKey().notNull(),
})

export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedBy: uuid("updatedBy").notNull(),
    email: text("email").notNull(),
  },
  (table) => {
    return {
      user_updatedBy_fkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [table.id],
        name: "user_updatedBy_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    }
  }
)

export const movement = pgTable("movement", {
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updatedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  productId: uuid("productId")
    .notNull()
    .references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" }),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  amount: bigint("amount", { mode: "number" }).notNull(),
  type: transaction_type("type").notNull(),
  productDetails: jsonb("productDetails").notNull(),
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  transactionId: uuid("transactionId")
    .notNull()
    .references(() => transaction.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
})

export const member = pgTable("member", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updatedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  role: role("role").notNull(),
})

export const product = pgTable("product", {
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedBy: uuid("updatedBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  shopId: uuid("shopId")
    .notNull()
    .references(() => shop.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text("name").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  currentStock: bigint("currentStock", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  cost: bigint("cost", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  price: bigint("price", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  commission: bigint("commission", { mode: "number" }).notNull(),
  status: status("status").notNull(),
  barcode: text("barcode"),
  description: text("description"),
  id: uuid("id").defaultRandom().primaryKey().notNull(),
})
