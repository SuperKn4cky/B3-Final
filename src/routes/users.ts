import { db, app } from "../index.js";
import { sql } from "drizzle-orm";
import xss from "xss";
import { users, selectUserSchema, insertUserSchema } from "../db/schema/users.js";
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
        console.error(
            "Erreur lors de la récupération des utilisateurs :",
            error,
        );
        res.status(500).json({
            message: "Erreur lors de la récupération des utilisateurs.",
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
                message: "Utilisateur non trouvé.",
                user: `id: ${id}`,
            });
        } else {
            const validatedUsers = User.map((user) => {
                return selectUserSchema.parse(user);
            });
            res.status(200).json(validatedUsers);
        }
    } catch (error) {
        console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            error,
        );
        res.status(500).json({
            message: "Erreur lors de la récupération de l'utilisateur.",
            error,
        });
    }
});

app.post(
    "/users",
    /*csrfProtection,*/ async (req, res) => {
        try {
            const sanitizedBody = {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                comment: xss(req.body.comment),
                role: req.body.role,
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