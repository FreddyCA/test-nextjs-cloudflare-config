import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// SEMBRANDO EL FORMATO DE LA BASE DE DATOS
// NO COMENTAR NI UNA POR QUE SINO SE VA A LA MRD TU BD, A MENOS QUE TENGAS UN RESPALDO DE TU DB

// USERS
export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});

// INVOICES
export const invoicesTable = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  customer_id: text("customer_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
});

// CUSTOMERS
export const customersTable = sqliteTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  image_url: text("image_url").notNull(),
});

// REVENUE
export const revenueTable = sqliteTable("revenue", {
  month: text("month").notNull().unique(),
  revenue: integer("revenue").notNull(),
});
