import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = mysqlTable("users", {
    id: int().autoincrement().primaryKey(),
    name: varchar("255"),
    password: varchar("255"),
    mail: varchar("255"),
});

export const insertUserSchema = createInsertSchema(users, {
    mail: (schema) => schema.mail.email(),
});
export const selectUserSchema = createSelectSchema(users, {
    id: (schema) => schema.id.positive(),
    mail: (schema) => schema.mail.email(),
});
