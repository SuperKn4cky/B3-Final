import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = mysqlTable("users", {
  id: int().autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
  password: varchar("password", { length: 255 }),
  mail: varchar("email", { length: 255 }),
});

export const insertUserSchema = createInsertSchema(users, {
  mail: (schema) => schema.mail.email(),
});

export const selectUserSchema = createSelectSchema(users, {
  id: (schema) => schema.id.positive(),
  mail: (schema) => schema.mail.email(),
});
