import { db, app } from "../../index";
import { eq } from "drizzle-orm";
import { users } from "../../db/schema/users";

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            res.status(400).json({ message: "Invalid user ID." });
        } else {

            const [result] = await db
                .delete(users)
                .where(eq(users.id, numericId))
                .execute();

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "User not found." });
            } else {
                res.status(200).json({ message: "User successfully deleted." });
            }
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            message: "Error deleting user:",
            error,
        });
    }
});
