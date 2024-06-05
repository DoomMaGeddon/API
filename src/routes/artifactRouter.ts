import express from 'express';
import { Artefactos } from '../entity/Artefactos';
import datasource from "../db/datasource";
import { artifactSchema } from '../schemas/artifactSchema';
import { enviarCorreoEntrada } from '../utils/nodemailer';
import { z } from 'zod';
import { getEmails } from './userRouter';
import jwt from 'jsonwebtoken';

const artifactRouter = express.Router();
const artifactRepository = datasource.getRepository(Artefactos);

artifactRouter.get("/", async (_req, res) => {
    try {
        const artifacts = await artifactRepository.find();
        res.status(200).send(artifacts);
    } catch (error) {
        res.status(500).send(error);
    }
});

artifactRouter.get("/:id", async (req, res) => {
    try {
        const artifact = await artifactRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (artifact) {
            res.status(200).json(artifact);
        } else {
            res.status(404).send("Artefacto no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al buscar el artefacto. " + error);
    }
});

artifactRouter.post("/", async (req, res) => {
    try {
        const { email: tokenEmail } = jwt.decode(req.header("auth-token") as string) as { email: string };
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol === "Estándar") {
            return res.status(401).json({ error: "Solo usuarios con rol Científico o Admin pueden realizar esta acción" });
        }

        if (tokenEmail !== req.body.email) {
            return res.status(401).json({ error: "El correo electrónico de la petición no pertenece al usuario logueado" });
        }

        const validatedData = artifactSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el artefacto",
                errors: validatedData.error.errors,
            });
        }

        await artifactRepository.save(artifactRepository.create(req.body));
        const users = await getEmails();
        users.forEach((email) => {
            if (typeof email === 'string' && email !== "") {
                enviarCorreoEntrada(email)
            }
        })
        return res.status(200).send("Artefacto guardado correctamente");
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Error al validar los datos",
                errors: error.errors,
            });
        } else {
            return res.status(500).send("Error al guardar el artefacto.\n" + error);
        }
    }
});

artifactRouter.put("/:id", async (req, res) => {
    try {
        const validatedData = artifactSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el artefacto",
                errors: validatedData.error.errors,
            });
        }

        await artifactRepository.update(req.params.id, req.body);
        return res.status(200).send("Artefacto actualizado correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar el artefacto");
    }
});

artifactRouter.delete("/:id", async (req, res) => {
    try {
        await artifactRepository.delete(req.params.id);
        res.status(200).send("Artefacto eliminado correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar el artefacto");
    }
});

export default artifactRouter;