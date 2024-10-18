import { db, app } from "./index.js";
import { users, selectUserSchema } from "./db/schema/users.js";

app.post("/users", async (req, res) => {
    try {
        await db.insert(users).values(req.body).execute();
    } catch (error) {
        console.error("Erreur lors de l'insertion de utilisateur :", error);
        res.status(500).json({
            message: "Erreur lors de l'insertion de utilisateur",
        });
    }
});
