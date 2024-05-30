import express from 'express';
import { Rangos } from '../entity/Rangos';
import datasource from "../db/datasource";
import { rankSchema } from '../schemas/rankSchema';

const rankRouter = express.Router();
const rankRepository = datasource.getRepository(Rangos);

rankRouter.get("/", async (_req, res) => {
    try {
        const ranks = await rankRepository.find();
        res.status(200).send(ranks);
    } catch (error) {
        res.status(500).send(error);
    }
});

rankRouter.get("/:id", async (req, res) => {
    try {
        const rank = await rankRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (rank) {
            res.status(200).json(rank);
        } else {
            res.status(404).send("Rango no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al buscar el rango. " + error);
    }
});

rankRouter.post("/", async (req, res) => {
    try {
        const validatedData = rankSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el rango",
                errors: validatedData.error.errors,
            });
        }

        await rankRepository.save(rankRepository.create(validatedData.data));
        return res.status(200).send("Rango guardado correctamente");
    } catch (error) {
        return res.status(500).send("Error al guardar el rango. " + error);
    }
});

rankRouter.put("/:id", async (req, res) => {
    try {
        const validatedData = rankSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el rango",
                errors: validatedData.error.errors,
            });
        }

        await rankRepository.update(req.params.id, validatedData.data);
        return res.status(200).send("Rango actualizado correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar el rango");
    }
});

rankRouter.delete("/:id", async (req, res) => {
    try {
        await rankRepository.delete(req.params.id);
        res.status(200).send("Rango eliminado correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar el rango");
    }
});

export default rankRouter;