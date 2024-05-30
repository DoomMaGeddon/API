import express from 'express';
import { Flora } from '../entity/Flora';
import datasource from "../db/datasource";
import { floraSchema } from '../schemas/floraSchema';

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

floraRouter.post("/", async (req, res) => {
    try {
        const validatedData = floraSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar la planta",
                errors: validatedData.error.errors,
            });
        }

        await floraRepository.save(floraRepository.create(req.body));
        return res.status(200).send("Planta guardada correctamente");
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