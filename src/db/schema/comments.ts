import { mysqlTable, int, varchar, timestamp, AnyMySqlColumn } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export const comments = mysqlTable("comments", {
    id: int().autoincrement().primaryKey().notNull(),
    content: varchar("content", { length: 1024 }).notNull(),
    author: int().references(() => users.id).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    parent_id: int().references((): AnyMySqlColumn => comments.id),
});

export const insertCommentSchema = createInsertSchema(comments, {
    content: (schema) => schema.content.max(1024),
    author: (schema) => schema.author.positive(),
    parent_id: (schema) => schema.parent_id.positive().nullable(),
});

export const selectCommentSchema = createSelectSchema(comments, {
    id: (schema) => schema.id,
    content: (schema) => schema.content,
    author: (schema) => schema.author,
    created_at: (schema) => schema.created_at,
    parent_id: (schema) => schema.parent_id,
});