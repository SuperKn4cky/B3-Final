import { drizzle } from "drizzle-orm/mysql2";
import express from "express";
import { fromError } from "zod-validation-error";

export let db: ReturnType<typeof drizzle>;

async function startDatabase() {
  try {
    db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
    await db.execute("select 1");
    console.log("connected to db");
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
  }
}

export const app = express();
const port = 3000;

app.use(express.json());

async function startServer() {
  await startDatabase();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
