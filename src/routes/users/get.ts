import { db, app } from "../../index";
import { sql } from "drizzle-orm";
import { users, selectUserSchema } from "../../db/schema/users";
//import csurf from "csurf";

//const csrfProtection = csurf({ cookie: true });

app.get("/users", async (req, res) => {
    try {
        const allUsers = await db.select().from(users);
        const validatedUsers = allUsers.map((user) => {
            return selectUserSchema.parse(user);
        });
        res.status(200).json(validatedUsers);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({
            message: "Error retrieving users.",
            error,
        });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const User = await db
            .select()
            .from(users)
            .where(sql`${users.id} = ${id}`);
        if (User.length === 0) {
            res.status(404).json({
                message: "User not found.",
                user: `id: ${id}`,
            });
        } else {
            const validatedUser = User.map((user) => {
                return selectUserSchema.parse(user);
            });
            res.status(200).json(validatedUser);
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            message: "Error retrieving user:",
            error,
        });
    }
});
