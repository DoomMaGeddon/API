import express from 'express';
import { Capas } from '../entity/Capas';
import datasource from "../db/datasource";
import { layerSchema } from '../schemas/layerSchema';

const layerRouter = express.Router();
const layerRepository = datasource.getRepository(Capas);

layerRouter.get("/", async (_req, res) => {
    try {
        const layers = await layerRepository.find();
        res.status(200).send(layers);
    } catch (error) {
        res.status(500).send(error);
    }
});

layerRouter.get("/:num", async (req, res) => {
    try {
        const layer = await layerRepository.findOne({
            where: { numero: parseInt(req.params.num) }
        });
        if (layer) {
            res.status(200).json(layer);
        } else {
            res.status(404).send("Capa no encontrada");
        }
    } catch (error) {
        res.status(500).send("Error al buscar la capa. " + error);
    }
});

layerRouter.post("/", async (req, res) => {
    try {
        const validatedData = layerSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar la capa",
                errors: validatedData.error.errors,
            });
        }

        await layerRepository.save(layerRepository.create(validatedData.data));
        return res.status(200).send("Capa guardada correctamente");
    } catch (error) {
        return res.status(500).send("Error al guardar la capa. " + error);
    }
});

layerRouter.put("/:num", async (req, res) => {
    try {
        const validatedData = layerSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar la capa",
                errors: validatedData.error.errors,
            });
        }

        await layerRepository.update(req.params.num, validatedData.data);
        return res.status(200).send("Capa actualizada correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar la capa");
    }
});

layerRouter.delete("/:num", async (req, res) => {
    try {
        await layerRepository.delete(req.params.num);
        res.status(200).send("Capa eliminada correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar la capa");
    }
});

export default layerRouter;