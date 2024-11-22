import { db, app } from "../../index";
import { eq } from "drizzle-orm";
import { comments } from "../../db/schema/comments";

app.delete("/comments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            res.status(400).json({ message: "Invalid comment ID." });
        } else {

            const [result] = await db
                .delete(comments)
                .where(eq(comments.id, numericId))
                .execute();

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Comment not found." });
            } else {
                res.status(200).json({ message: "Comment successfully deleted." });
            }
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            message: "Error deleting comment:",
            error,
        });
    }
});