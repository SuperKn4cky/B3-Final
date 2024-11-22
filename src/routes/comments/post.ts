import { db, app } from "../../index";
import xss from "xss";
import { comments, insertCommentSchema } from "../../db/schema/comments";

app.post(
    "/comments",
    /*csrfProtection,*/ async (req, res) => {
        try {
            const sanitizedBody = {
                content: req.body.content ? xss(req.body.content) : null,
                author: req.body.author,
                parent_id: req.body.parent_id || null,
            };
            const validatedInsert = insertCommentSchema.parse(sanitizedBody);

            await db.insert(comments).values(validatedInsert).execute();

            res.status(201).json({
                message: "Comment successfully created",
                //csrfToken: req.csrfToken(),
            });
        } catch (error) {
            console.error("Error inserting comment:", error);
            res.status(500).json({
                message: "Error inserting comment:",
                error,
            });
        }
    },
);
