import { db, app } from "./index.js";
import { users, selectUserSchema } from "./db/schema/users.js";

app.post("/users", async (req, res) => {
    try {
        const validatedInsert = selectUserSchema.parse(req.body);
        await db.insert(users).values(validatedInsert).execute();
        res.status(201).json({
            message: "Utilisateur inséré avec succès",
        });
    } catch (error) {
        console.error("Erreur lors de l'insertion de utilisateur :", error);
        res.status(500).json({
            message: "Erreur lors de l'insertion de utilisateur",
        });
    }
});
