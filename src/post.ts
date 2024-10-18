import { db, app } from "./index.js";
import xss from "xss";
//import csurf from "csurf";
import { users, insertUserSchema } from "./db/schema/users.js";

//const csrfProtection = csurf({ cookie: true });

app.post(
    "/users",
    /*csrfProtection,*/ async (req, res) => {
        try {
            const sanitizedBody = {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                comment: xss(req.body.comment),
            };
            const validatedInsert = insertUserSchema.parse(sanitizedBody);
            await db.insert(users).values(validatedInsert).execute();
            res.status(201).json({
                message: "Utilisateur inséré avec succès",
                //csrfToken: req.csrfToken(),
            });
        } catch (error) {
            console.error("Erreur lors de l'insertion de utilisateur :", error);
            res.status(500).json({
                message: "Erreur lors de l'insertion de utilisateur.",
                error,
            });
        }
    },
);
