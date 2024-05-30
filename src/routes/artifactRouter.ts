import express from 'express';
import { Artefactos } from '../entity/Artefactos';
import datasource from "../db/datasource";
import { artifactSchema } from '../schemas/artifactSchema';
import { z } from 'zod';

const artifactRouter = express.Router();
const artifactRepository = datasource.getRepository(Artefactos);

artifactRouter.get("/test", async (_req, res) => {
    try {
        res.status(200).send("TEST");
    } catch (error) {
        res.status(500).send(error);
    }
});

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
        const validatedData = artifactSchema.parse(req.body); //Me apetecía usar ambos métodos de validación
        const newArtifact = artifactRepository.create(validatedData);
        await artifactRepository.save(newArtifact);
        res.status(200).send("Artefacto guardado correctamente");
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Error al validar los datos",
                errors: error.errors,
            });
        } else {
            res.status(500).send("Error al guardar el artefacto.\n" + error);
        }
    }
});

artifactRouter.put("/:id", async (req, res) => {
    try {
        const validatedData = artifactSchema.safeParse(req.body);

        if (!validatedData.success) { //Este método de validación me parece más cómodo, por lo que será el que use en el resto
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