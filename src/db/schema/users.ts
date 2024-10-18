import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
export const users = mysqlTable("users", {
  id: int().autoincrement(),
  name: varchar("255"),
  password: varchar("255"),
  mail: varchar("255"),
});
