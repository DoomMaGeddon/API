import express from 'express';
import { Exploradores } from '../entity/Exploradores';
import datasource from "../db/datasource";
import { delverSchema } from '../schemas/delverSchema';
import { getEmails, giveExp } from './userRouter';
import { enviarCorreoEntrada } from '../utils/nodemailer';
import jwt from 'jsonwebtoken';
import validateToken from '../utils/validateToken';

const delverRouter = express.Router();
const delverRepository = datasource.getRepository(Exploradores);

delverRouter.get("/", async (_req, res) => {
    try {
        const delvers = await delverRepository.find();
        res.status(200).send(delvers);
    } catch (error) {
        res.status(500).send(error);
    }
});

delverRouter.get("/:id", async (req, res) => {
    try {
        const delver = await delverRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (delver) {
            res.status(200).json(delver);
        } else {
            res.status(404).send("Explorador no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al buscar el explorador. " + error);
    }
});

delverRouter.get("/me/history", validateToken, async (req, res) => {
    try {
        const { email: tokenEmail } = jwt.decode(req.header("auth-token") as string) as { email: string };
        const delvers = await delverRepository.find({ where: { creadorEmail: tokenEmail } });
        res.status(200).json({ delvers });
    } catch (error) {
        res.status(500).send(error);
    }
});

delverRouter.get("/ids/all/list", async (_req, res) => {
    try {
        const delvers = await delverRepository.find();
        const delverIds = delvers.map(delver => delver.id + "");
        res.status(200).send(delverIds);
    } catch (error) {
        res.status(500).send(error);
    }
});

delverRouter.get("/", async (_req, res) => {
    try {
        const delvers = await delverRepository.find();
        res.status(200).send(delvers);
    } catch (error) {
        res.status(500).send(error);
    }
});

delverRouter.post("/", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol === "Estándar") {
            return res.status(401).json({ error: "Solo usuarios con rol Científico o Admin pueden realizar esta acción" });
        }

        const validatedData = delverSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el explorador",
                errors: validatedData.error.errors,
            });
        }

        await delverRepository.save(delverRepository.create(validatedData.data));
        const users = await getEmails();
        users.forEach((email) => {
            if (typeof email === 'string' && email !== "") {
                enviarCorreoEntrada(email)
            }
        });

        if (validatedData.data.original && validatedData.data.creadorEmail) {
            giveExp(validatedData.data.creadorEmail);
        }

        return res.status(200).json({ status: "200", message: "Explorador guardado correctamente" });
    } catch (error) {
        return res.status(500).send("Error al guardar el explorador. " + error);
    }
});

delverRouter.put("/:id", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo administradores pueden realizar esta acción" });
        }

        const validatedData = delverSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el explorador",
                errors: validatedData.error.errors,
            });
        }

        await delverRepository.update(req.params.id, req.body);
        return res.status(200).send("Explorador actualizado correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar el explorador");
    }
});

delverRouter.delete("/:id", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo administradores pueden realizar esta acción" });
        }

        await delverRepository.delete(req.params.id);
        return res.status(200).send("Explorador eliminado correctamente");
    } catch (error) {
        return res.status(500).send("Error al eliminar el explorador");
    }
});

export default delverRouter;