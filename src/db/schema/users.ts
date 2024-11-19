import { mysqlTable, int, varchar, mysqlEnum } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = mysqlTable("users", {
    id: int().autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    comment: varchar("comment", { length: 255 }),
    role: mysqlEnum("role", ["student", "teacher", "admin"]).notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
    name: (schema) =>
      schema.name
        .min(2, { message: "Must be 2 or more characters." })
        .max(50, { message: "Must be 50 maximum." })
        .regex(/^[a-zA-Z ]+$/, { message: "Must be only letters." }),
    email: (schema) => schema.email.email(),
    password: (schema) =>
      schema.password
        .min(8, { message: "Password must have at least 8 characters." })
        .max(255)
        .regex(/^[a-zA-Z0-9]+$/, { message: "Password must contain only letters and numbers." }),
    comment: (schema) => schema.comment.optional().nullable(),
    role: (schema) => schema.role,
});

export const selectUserSchema = createSelectSchema(users, {
    id: (schema) => schema.id,
    email: (schema) => schema.email.email(),
    role: (schema) => schema.role,
});
