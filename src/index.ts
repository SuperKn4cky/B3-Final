import { drizzle } from "drizzle-orm/mysql2";
import express from "express";
import { users } from "./db/schema/users";

export let db: ReturnType<typeof drizzle>;

async function startDatabase() {
  try {
    db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
    const response = await db.select().from(users);
    console.log(response);
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
  }
}

startDatabase();

export const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
