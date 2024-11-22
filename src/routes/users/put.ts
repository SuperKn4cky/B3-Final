import { db, app } from "../../index";
import { eq } from "drizzle-orm";
import xss from "xss";
import { users, insertUserSchema } from "../../db/schema/users";

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            res.status(400).json({ message: "Invalid user ID." });
        }

        const sanitizedBody = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            description: req.body.description
                ? xss(req.body.description)
                : null,
            role: req.body.role,
        };

        const validatedUpdate = insertUserSchema.partial().parse(sanitizedBody);

        const [result] = await db
            .update(users)
            .set(validatedUpdate)
            .where(eq(users.id, numericId))
            .execute();

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "User not found." });
        } else {
            res.status(200).json({ message: "User successfully updated." });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "Error updating user:",
            error,
        });
    }
});
