import { drizzle } from "drizzle-orm/mysql2";
import express, { Request, Response, NextFunction } from "express";
import { fromError } from "zod-validation-error";
import { z } from "zod";

export let db: ReturnType<typeof drizzle>;

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1, "Missing env file or incorrect format: 'DATABASE_URL=mysql://<user>:<password>@<host>:<port>/<database>'"),
});

function validateEnv() {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    const formattedError = fromError(error);
    throw new Error(formattedError.message);
  }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Une erreur est survenue lors de la connexion à la base de données.",
    details: err.message || "Erreur inconnue",
  });
};

async function startDatabase() {
  try {
    validateEnv();
    db = drizzle({ connection: { uri: process.env.DATABASE_URL! } });
    await db.execute("select 1");
    console.log("connected to db");
  } catch (error) {
    throw error;
  }
}

export const app = express();
const port = 3000;

app.use(express.json());

app.use(errorHandler);

async function startServer() {
  try {
    await startDatabase();
    
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erreur lors de la connexion à la base de données : ${error.message}`);
    } else {
      console.error("Erreur inconnue lors de la connexion à la base de données.");
    }
  }
}

startServer();
