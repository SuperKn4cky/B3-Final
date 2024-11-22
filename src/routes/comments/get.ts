import { db, app } from "../../index";
import { eq } from "drizzle-orm";
import { comments, selectCommentSchema } from "../../db/schema/comments";
//import csurf from "csurf";

//const csrfProtection = csurf({ cookie: true });

app.get("/comments", async (req, res) => {
    try {
        const allUsers = await db.select().from(comments);
        const validatedUsers = allUsers.map((user) => {
            return selectCommentSchema.parse(user);
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

app.get("/comments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            res.status(400).json({ message: "Invalid comment ID." });
        } else {
            const Comment = await db
                .select()
                .from(comments)
                .where(eq(comments.id, numericId));
            if (Comment.length === 0) {
                res.status(404).json({
                    message: "Comment not found.",
                    comment: `id: ${id}`,
                });
            } else {
                const validatedComment = Comment.map((comment) => {
                    return selectCommentSchema.parse(comment);
                });
                res.status(200).json(validatedComment);
            }
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            message: "Error retrieving user:",
            error,
        });
    }
});
