import express from 'express';
import { Entradas } from '../entity/Entradas';
import datasource from "../db/datasource";
import { entrySchema } from '../schemas/entrySchema';

const entryRouter = express.Router();
const entryRepository = datasource.getRepository(Entradas);

entryRouter.get("/", async (_req, res) => {
    try {
        const entries = await entryRepository.find();
        res.status(200).send(entries);
    } catch (error) {
        res.status(500).send(error);
    }
});

entryRouter.get("/:id", async (req, res) => {
    try {
        const entry = await entryRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (entry) {
            res.status(200).json(entry);
        } else {
            res.status(404).send("Entrada no encontrada");
        }
    } catch (error) {
        res.status(500).send("Error al buscar la entrada. " + error);
    }
});

entryRouter.post("/", async (req, res) => {
    try {
        const validatedData = entrySchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar la entrada",
                errors: validatedData.error.errors,
            });
        }

        await entryRepository.save(entryRepository.create(validatedData.data));
        return res.status(200).send("Entrada guardada correctamente");
    } catch (error) {
        return res.status(500).send("Error al guardar la entrada. " + error);
    }
});

entryRouter.put("/:id", async (req, res) => {
    try {
        const validatedData = entrySchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar la entrada",
                errors: validatedData.error.errors,
            });
        }

        await entryRepository.update(req.params.id, req.body);
        return res.status(200).send("Entrada actualizada correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar la entrada");
    }
});

entryRouter.delete("/:id", async (req, res) => {
    try {
        await entryRepository.delete(req.params.id);
        res.status(200).send("Entrada eliminada correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar la entrada");
    }
});

export default entryRouter;