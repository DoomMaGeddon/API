import express from 'express';
import { Solicitudes } from '../entity/Solicitudes';
import datasource from "../db/datasource";
import { requestSchema } from '../schemas/requestSchema';
import validateToken from '../utils/validateToken';

const requestRouter = express.Router();
const requestRepository = datasource.getRepository(Solicitudes);

requestRouter.get("/", async (_req, res) => {
    try {
        const requests = await requestRepository.find();
        res.status(200).send(requests);
    } catch (error) {
        res.status(500).send(error);
    }
});

requestRouter.get("/:id", async (req, res) => {
    try {
        const request = await requestRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (request) {
            res.status(200).json(request);
        } else {
            res.status(404).send("Petición no encontrada");
        }
    } catch (error) {
        res.status(500).send("Error al buscar la petición. " + error);
    }
});

requestRouter.post("/", validateToken, async (req, res) => {
    try {
        const validatedData = requestSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                status: "400",
                message: "Error al validar la petición",
                errors: validatedData.error.errors,
            });
        }

        await requestRepository.save(requestRepository.create(validatedData.data));
        return res.status(200).json({ status: "200", message: "Petición guardada correctamente" });
    } catch (error) {
        return res.status(500).send("Error al guardar la petición. " + error);
    }
});

requestRouter.put("/:id", async (req, res) => {
    try {
        const validatedData = requestSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar la petición",
                errors: validatedData.error.errors,
            });
        }

        await requestRepository.update(req.params.id, validatedData.data);
        return res.status(200).send("Petición actualizado correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar la petición");
    }
});

requestRouter.delete("/:id", async (req, res) => {
    try {
        await requestRepository.delete(req.params.id);
        res.status(200).send("Petición eliminado correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar la petición");
    }
});

export default requestRouter;