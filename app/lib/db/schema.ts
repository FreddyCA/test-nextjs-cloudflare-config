import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
// export const usersTable = sqliteTable("users", {
//   id: integer("id").primaryKey(),
//   name: text("name").notNull(),
//   age: integer("age").notNull(),
//   email: text("email").unique().notNull(),
// });

export const messagesTable = sqliteTable("messages", {
  id: integer("id").primaryKey(),
  message: text("name").notNull(),
});

// SEMBRANDO EL FORMATO DE LA BASE DE DATOS
// USERS

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey().default(`uuid_generate_v4()`),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});
