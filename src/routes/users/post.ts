import { db, app } from "../../index";
import xss from "xss";
import { users, insertUserSchema } from "../../db/schema/users";

app.post(
    "/users",
    /*csrfProtection,*/ async (req, res) => {
        try {
            const sanitizedBody = {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                description: req.body.description
                    ? xss(req.body.description)
                    : null,
                role: req.body.role,
            };
            const validatedInsert = insertUserSchema.parse(sanitizedBody);

            await db.insert(users).values(validatedInsert).execute();

            res.status(201).json({
                message: "User successfully created",
                //csrfToken: req.csrfToken(),
            });
        } catch (error) {
            console.error("Error inserting user:", error);
            res.status(500).json({
                message: "Error inserting user:",
                error,
            });
        }
    },
);
