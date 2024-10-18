import { drizzle } from "drizzle-orm/mysql2";
import express from "express";

const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
