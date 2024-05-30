import express from 'express';
import { GruposExploradores } from '../entity/GruposExploradores';
import datasource from "../db/datasource";
import { delverGroupSchema } from '../schemas/delverGroupSchema';

const delverGroupRouter = express.Router();
const delverGroupRepository = datasource.getRepository(GruposExploradores);

delverGroupRouter.get("/", async (_req, res) => {
    try {
        const delverGroups = await delverGroupRepository.find();
        res.status(200).send(delverGroups);
    } catch (error) {
        res.status(500).send(error);
    }
});

delverGroupRouter.get("/:id", async (req, res) => {
    try {
        const delverGroup = await delverGroupRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (delverGroup) {
            res.status(200).json(delverGroup);
        } else {
            res.status(404).send("Grupo explorador no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al buscar el grupo explorador. " + error);
    }
});

delverGroupRouter.post("/", async (req, res) => {
    try {
        const validatedData = delverGroupSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el grupo explorador",
                errors: validatedData.error.errors,
            });
        }

        await delverGroupRepository.save(delverGroupRepository.create(validatedData.data));
        return res.status(200).send("Grupo explorador guardado correctamente");
    } catch (error) {
        return res.status(500).send("Error al guardar el grupo explorador. " + error);
    }
});

delverGroupRouter.put("/:id", async (req, res) => {
    try {
        const validatedData = delverGroupSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el grupo explorador",
                errors: validatedData.error.errors,
            });
        }

        await delverGroupRepository.update(req.params.id, req.body);
        return res.status(200).send("Grupo explorador actualizado correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar el grupo explorador");
    }
});

delverGroupRouter.delete("/:id", async (req, res) => {
    try {
        await delverGroupRepository.delete(req.params.id);
        res.status(200).send("Grupo explorador eliminado correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar el grupo explorador");
    }
});

export default delverGroupRouter;