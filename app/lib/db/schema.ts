import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// SEMBRANDO EL FORMATO DE LA BASE DE DATOS
// NO COMENTAR NI UNA POR QUE SINO SE VA A LA MRD TU BD, A MENOS QUE TENGAS UN RESPALDO DE TU DB

// USERS
export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey().default(`uuid_generate_v4()`),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});

// INVOICES
export const invoicesTable = sqliteTable("invoices", {
  // id: text("id").primaryKey().default(sql`uuid_generate_v4()`), // sirve para que se genere en el servidor
  id: text("id").primaryKey().default(`uuid_generate_v4()`),
  customer_id: text("customer_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(), // Utilizamos text para almacenar la fecha
});

// CUSTOMERS
export const customersTable = sqliteTable("customers", {
  id: text("id").primaryKey().default(`uuid_generate_v4()`),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});

// REVENUE
export const revenueTable = sqliteTable("revenue", {
  month: text("month").notNull().unique(),
  revenue: integer("revenue").notNull(),
});
