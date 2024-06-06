import express from 'express';
import { Flora } from '../entity/Flora';
import datasource from "../db/datasource";
import { floraSchema } from '../schemas/floraSchema';
import { enviarCorreoEntrada } from '../utils/nodemailer';
import { getEmails } from './userRouter';
import validateToken from '../utils/validateToken';
import jwt from 'jsonwebtoken';

const floraRouter = express.Router();
const floraRepository = datasource.getRepository(Flora);

floraRouter.get("/", async (_req, res) => {
    try {
        const flora = await floraRepository.find();
        res.status(200).send(flora);
    } catch (error) {
        res.status(500).send(error);
    }
});

floraRouter.get("/:layerNum", async (req, res) => {
    try {
        const layerNum = parseInt(req.params.layerNum);
        const flora = await floraRepository.find({ where: { habitat: layerNum } })

        res.status(200).send(flora);
    } catch (error) {
        res.status(500).send(error);
    }
});

floraRouter.get("/:id", async (req, res) => {
    try {
        const plant = await floraRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (plant) {
            res.status(200).json(plant);
        } else {
            res.status(404).send("Planta no encontrada");
        }
    } catch (error) {
        res.status(500).send("Error al buscar la planta. " + error);
    }
});

floraRouter.get("/me/history", async (req, res) => {
    try {
        const { email: tokenEmail } = jwt.decode(req.header("auth-token") as string) as { email: string };
        const flora = await floraRepository.find({ where: { creadorEmail: tokenEmail } })

        res.status(200).json({ flora });
    } catch (error) {
        res.status(500).send(error);
    }
});


floraRouter.post("/", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol === "Estándar") {
            return res.status(401).json({ error: "Solo usuarios con rol Científico o Admin pueden realizar esta acción" });
        }

        const validatedData = floraSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar la planta",
                errors: validatedData.error.errors,
            });
        }

        await floraRepository.save(floraRepository.create(req.body));
        const users = await getEmails();
        users.forEach((email) => {
            if (typeof email === 'string' && email !== "") {
                enviarCorreoEntrada(email)
            }
        })
        return res.status(200).json({ status: "200", message: "Planta guardada correctamente" });
    } catch (error) {
        return res.status(500).send("Error al guardar la planta. " + error);
    }
});

floraRouter.put("/:id", async (req, res) => {
    try {
        const validatedData = floraSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar la planta",
                errors: validatedData.error.errors,
            });
        }

        await floraRepository.update(req.params.id, req.body);
        return res.status(200).send("Planta actualizada correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar la planta");
    }
});

floraRouter.delete("/:id", async (req, res) => {
    try {
        await floraRepository.delete(req.params.id);
        res.status(200).send("Planta eliminada correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar la planta");
    }
});

export default floraRouter;