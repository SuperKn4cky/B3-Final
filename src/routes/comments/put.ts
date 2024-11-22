import { db, app } from "../../index";
import { eq } from "drizzle-orm";
import xss from "xss";
import { comments, insertCommentSchema } from "../../db/schema/comments";

app.put("/comments/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            res.status(400).json({ message: "Invalid comment ID." });
        } else {

            const sanitizedBody = {
                content: req.body.content ? xss(req.body.content) : null,
                author: req.body.author,
                parent_id: req.body.parent_id || null,
            };

            const validatedUpdate = insertCommentSchema.partial().parse(sanitizedBody);

            const [result] = await db
                .update(comments)
                .set(validatedUpdate)
                .where(eq(comments.id, numericId))
                .execute();

            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Comment not found." });
            } else {
                res.status(200).json({ message: "Comment successfully updated." });
            }
        }
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({
            message: "Error updating comment:",
            error,
        });
    }
});
