import express from 'express';
import { Exploradores } from '../entity/Exploradores';
import datasource from "../db/datasource";
import { delverSchema } from '../schemas/delverSchema';
import { getEmails } from './userRouter';
import { enviarCorreo } from '../utils/nodemailer';

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

delverRouter.post("/", async (req, res) => {
    try {
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
                enviarCorreo(email)
            }
        })
        return res.status(200).send("Explorador guardado correctamente");
    } catch (error) {
        return res.status(500).send("Error al guardar el explorador. " + error);
    }
});

delverRouter.put("/:id", async (req, res) => {
    try {
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

delverRouter.delete("/:id", async (req, res) => {
    try {
        await delverRepository.delete(req.params.id);
        res.status(200).send("Explorador eliminado correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar el explorador");
    }
});

export default delverRouter;