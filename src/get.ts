import { db, app } from "./index.js";
import { users, selectUserSchema } from "./db/schema/users.js";

app.get("/users", async (req, res) => {
    try {
        const allUsers = await db.select().from(users);
        const validatedUsers = allUsers.map((user) => {
            return selectUserSchema.parse(user);
        });
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des utilisateurs :",
            error,
        );
        res.status(500).json({
            message: "Erreur lors de la récupération des utilisateurs",
        });
    }
});
