import { db, app } from "../index.js";
import { sql } from "drizzle-orm";
import xss from "xss";
import {
    users,
    selectUserSchema,
    insertUserSchema,
} from "../db/schema/users.js";
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
            const validatedUsers = User.map((user) => {
                return selectUserSchema.parse(user);
            });
            res.status(200).json(validatedUsers);
        }
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({
            message: "Error retrieving user:",
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
                comment: req.body.comment ? xss(req.body.comment) : null,
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

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const sanitizedBody = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            comment: req.body.comment ? xss(req.body.comment) : null,
            role: req.body.role,
        };

        const validatedUpdate = insertUserSchema.partial().parse(sanitizedBody);

        const [result] = await db
            .update(users)
            .set(validatedUpdate)
            .where(sql`${users.id} = ${id}`)
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

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db
            .delete(users)
            .where(sql`${users.id} = ${id}`)
            .execute();

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "User not found." });
        } else {
            res.status(200).json({ message: "User successfully deleted." });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            message: "Error deleting user:",
            error,
        });
    }
});
