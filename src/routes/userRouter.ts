import express from 'express';
import { Usuarios } from '../entity/Usuarios';
import { Rangos } from '../entity/Rangos';
import { JWT_EXPIRES, TOKEN_SECRET } from '../config/env-variables';
import datasource from "../db/datasource";
import validateToken from "../utils/validateToken";
import { addToBlacklist } from "../utils/blacklist";
import * as tokenStore from "../utils/tokenStore";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userSchema } from '../schemas/userSchema';
import { enviarCorreoRegistro } from '../utils/nodemailer';
import { userUpdateSchema } from '../schemas/userUpdateSchema';

const userRouter = express.Router();
const userRepository = datasource.getRepository(Usuarios);
const rankRepository = datasource.getRepository(Rangos);

export async function getEmails() {
    try {
        const users = await userRepository.find({
            where: { notificaciones: true },
            select: ["email"]
        });

        if (users && users.length > 0) {
            const emails = users.map(user => user.email);
            return emails;
        } else {
            return [];
        }
    } catch (error) {
        return [error];
    }
}

userRouter.get("/", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        const users = await userRepository.find();
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send(error);
    }
});

userRouter.get("/:email", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        const user = await userRepository.findOne(
            {
                where:
                    { email: req.params.email }
            }
        );
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        return res.status(500).send("Error al buscar el usuario. " + error);
    }
});

userRouter.post("/", async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };
        const { ...data } = req.body;

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        const validatedData = userSchema.safeParse(data);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el usuario",
                errors: validatedData.error.errors,
            });
        }

        if (data.contrasenya) {
            const salt = await bcrypt.genSalt(10);
            data.contrasenya = await bcrypt.hash(data.contrasenya, salt);
        }

        await userRepository.save(userRepository.create(data));
        return res.status(200).send("Usuario guardado correctamente");
    } catch (error) {
        return res.status(500).send("Error al guardar el usuario. " + error);
    }
});

userRouter.put("/:email", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };
        const { ...data } = req.body;

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        if (data.email) {
            delete data.email;
        }

        const validatedData = userUpdateSchema.safeParse(data);

        if (!validatedData.success) {
            console.log(validatedData.error.errors)
            return res.status(400).json({
                message: "Error al validar el usuario",
                errors: validatedData.error.errors,
            });
        }

        if (data.contrasenya) {
            const salt = await bcrypt.genSalt(10);
            data.contrasenya = await bcrypt.hash(data.contrasenya, salt);
        }

        await userRepository.update(req.params.email, data);
        return res.status(200).send("Usuario actualizado correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar el usuario");
    }
});

userRouter.delete("/:id", async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        await userRepository.delete(req.params.id);
        return res.status(200).send("Usuario eliminado correctamente");
    } catch (error) {
        return res.status(500).send("Error al eliminar el usuario");
    }
});

userRouter.get("/me", validateToken, async (req, res) => {
    try {
        const email = req.body.user;
        const user = await userRepository.findOne(email);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send("Error al actualizar la información del usuario");
    }
});

userRouter.put("/me/update", validateToken, async (req, res) => {
    try {
        const { ...data } = req.body;
        const { email: tokenEmail } = jwt.decode(req.header("auth-token") as string) as { email: string };

        if (tokenEmail !== data.email) {
            return res.status(401).json({ error: "El correo electrónico de la petición no pertenece al usuario a actualizar" });
        }

        if (data.contrasenya === undefined || data.contrasenya === "") {
            delete data.contrasenya;
        } else {
            const validatedData = userSchema.safeParse(data);
            if (!validatedData.success) {
                return res.status(400).json({
                    message: "Error al validar el usuario",
                    errors: validatedData.error.errors
                });
            }

            const salt = await bcrypt.genSalt(10);
            data.contrasenya = await bcrypt.hash(data.contrasenya, salt);
        }

        const email = req.body.email;

        await userRepository.update(email, data);

        return res.status(200).json({ status: "200", message: "Información del usuario actualizada correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error al actualizar la información del usuario");
    }
});

userRouter.post("/register", async (req, res) => {
    try {
        const validatedData = userSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el usuario",
                errors: validatedData.error.errors,
            });
        }

        const { email, contrasenya, ...data } = validatedData.data;
        const existingUser = await userRepository.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).send("El usuario ya existe");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(contrasenya, salt);

            await userRepository.save(userRepository.create({ email, contrasenya: hashedPass, ...data }));
            enviarCorreoRegistro(email)
            return res.status(201).json({
                email
            });
        }
    } catch (error) {
        return res.status(500).send("Error al registrar el usuario. " + error);
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, contrasenya } = req.body;
        const user = await userRepository.findOne({ where: { email: email } });

        if (!user) {
            return res.status(400).send("Datos incorrectos");
        }

        const validPass = await bcrypt.compare(contrasenya, user.contrasenya);
        if (!validPass) {
            return res.status(400).send("Datos incorrectos");
        }

        user.contrasenya = "";

        const token = jwt.sign({ email: user.email, rol: user.rol }, TOKEN_SECRET as string, { expiresIn: JWT_EXPIRES });
        tokenStore.addToken(token);
        return res.header("auth-token", token).status(200).json({ token, user });

    } catch (error) {
        return res.status(500).send("Error al iniciar sesión. " + error);
    }
});

userRouter.post("/logout", validateToken, (req, res) => {
    try {
        const token = req.header("auth-token");
        if (token) {
            addToBlacklist(token);
            tokenStore.removeToken(token);
            res.status(200).json({ status: "200", message: "Sesión cerrada correctamente" });
        } else {
            res.status(400).send("Token no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al cerrar sesión");
    }
});

export async function giveExp(userEmail: string) {
    try {
        const user = await userRepository.findOne({ where: { email: userEmail } });

        if (!user) {
            console.error("No se ha encontrado el usuario en el método giveExp");
            return false;
        }

        user.experiencia += 10;

        const rangos = await rankRepository.find();

        if (!rangos || rangos.length == 0) {
            console.error("No se ha encontrado rangos en el método giveExp");
            return false;
        }

        rangos.forEach((rango) => {
            if (user.experiencia > rango.requisito) {
                if (user.rangoId) {
                    if (user.rangoId < rango.id) {
                        user.rangoId = rango.id;
                    }
                } else {
                    user.rangoId = rango.id;
                }
            }
        })

        const { email, ...data } = user;
        await userRepository.update(userEmail, data);
        return true
    } catch (error) {
        console.error("No se ha podido actualizar el usuario en el método giveExp");
        console.error(error);
        return false;
    }
}

export default userRouter;