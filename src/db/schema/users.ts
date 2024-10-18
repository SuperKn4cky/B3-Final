import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = mysqlTable("users", {
  id: int().autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.name.min(3).max(255).regex(/^[a-zA-Z ]+$/),
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password.min(8).max(255).regex(/^[a-zA-Z0-9]+$/),
});

export const selectUserSchema = createSelectSchema(users, {
  id: (schema) => schema.id.positive(),
  email: (schema) => schema.email.email(),
});
