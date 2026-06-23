import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";


export const Payments = sqliteTable("payments", {
    id:integer("id").primaryKey({ autoIncrement: true }),
    teacher: text("teacher").notNull(),
    product: integer("product").notNull(),
    productName: text("productName").notNull(),
    productType:text("productType").notNull(),
    expiresAt:text("expiresAt").notNull(),
    tier:text("tier").notNull(),
    student:text("student").notNull(),
    price:integer("price").notNull().default(0),
    createdAt: text("created_at")
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`)
})