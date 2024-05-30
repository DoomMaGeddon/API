import express from 'express';
import { Usuarios } from '../entity/Usuarios';
import { JWT_EXPIRES, TOKEN_SECRET } from '../config/env-variables';
import datasource from "../db/datasource";
import validateToken from "../utils/validateToken";
import { addToBlacklist } from "../utils/blacklist";
import * as tokenStore from "../utils/tokenStore";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userSchema } from '../schemas/userSchema';

const userRouter = express.Router();
const userRepository = datasource.getRepository(Usuarios);

userRouter.get("/", async (_req, res) => {
    try {
        const users = await userRepository.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

userRouter.get("/:email", async (req, res) => {
    try {
        const user = await userRepository.findOne(
            {
                where:
                    { email: req.params.email }
            }
        );
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al buscar el usuario. " + error);
    }
});

userRouter.post("/", async (req, res) => {
    try {
        const validatedData = userSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el usuario",
                errors: validatedData.error.errors,
            });
        }

        await userRepository.save(userRepository.create(validatedData.data));
        return res.status(200).send("Usuario guardado correctamente");
    } catch (error) {
        return res.status(500).send("Error al guardar el usuario. " + error);
    }
});

userRouter.put("/:email", async (req, res) => {
    try {
        const validatedData = userSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el usuario",
                errors: validatedData.error.errors,
            });
        }

        const { contrasenya, ...data } = req.body;

        if (contrasenya) {
            const salt = await bcrypt.genSalt(10);
            data.contrasenya = await bcrypt.hash(contrasenya, salt);
        }

        await userRepository.update(req.params.email, data);
        return res.status(200).send("Usuario actualizado correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar el usuario");
    }
});

userRouter.delete("/:id", async (req, res) => {
    try {
        await userRepository.delete(req.params.id);
        res.status(200).send("Usuario eliminado correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar el usuario");
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

userRouter.put("/me", validateToken, async (req, res) => {
    try {
        const validatedData = userSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el usuario",
                errors: validatedData.error.errors,
            });
        }

        const { contrasenya, ...data } = req.body;
        const email = req.body.user;

        if (contrasenya) {
            const salt = await bcrypt.genSalt(10);
            data.contrasenya = await bcrypt.hash(contrasenya, salt);
        }

        await userRepository.update(email, data);
        return res.status(200).send("Información del usuario actualizada correctamente");
    } catch (error) {
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

        const { email, contrasenya, ...data } = req.body;
        const existingUser = await userRepository.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).send("El usuario ya existe");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(contrasenya, salt);

            await userRepository.save(userRepository.create({ email, contrasenya: hashedPass, ...data }));
            return res.status(201).send("Usuario registrado correctamente");
        }
    } catch (error) {
        return res.status(500).send("Error al registrar el usuario. " + error);
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, contrasenya } = req.body;
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            res.status(400).send("Datos incorrectos");
        } else {
            const validPass = await bcrypt.compare(contrasenya, user.contrasenya);
            if (!validPass) {
                res.status(400).send("Datos incorrectos");
            }

            const token = jwt.sign({ email: user.email }, TOKEN_SECRET as string, { expiresIn: JWT_EXPIRES });
            tokenStore.addToken(token);
            res.header("auth-token", token).status(200).send("Inicio de sesión exitoso");
        }
    } catch (error) {
        res.status(500).send("Error al iniciar sesión. " + error);
    }
});

userRouter.post("/logout", validateToken, (req, res) => {
    try {
        const token = req.header("auth-token");
        if (token) {
            addToBlacklist(token);
            tokenStore.removeToken(token);
            res.status(200).send("Sesión cerrada correctamente");
        } else {
            res.status(400).send("Token no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al cerrar sesión");
    }
});

export default userRouter;