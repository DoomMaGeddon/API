import express from 'express';
import { Fauna } from '../entity/Fauna';
import datasource from "../db/datasource";
import { faunaSchema } from '../schemas/faunaSchema';

const faunaRouter = express.Router();
const faunaRepository = datasource.getRepository(Fauna);

faunaRouter.get("/", async (_req, res) => {
    try {
        const fauna = await faunaRepository.find();
        res.status(200).send(fauna);
    } catch (error) {
        res.status(500).send(error);
    }
});

faunaRouter.get("/:layerNum", async (req, res) => {
    try {
        const layerNum = parseInt(req.params.layerNum);
        const fauna = await faunaRepository.find({ where: { habitat: layerNum } })

        res.status(200).send(fauna);
    } catch (error) {
        res.status(500).send(error);
    }
});

faunaRouter.get("/:id", async (req, res) => {
    try {
        const fauna = await faunaRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (fauna) {
            res.status(200).json(fauna);
        } else {
            res.status(404).send("Animal no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error al buscar el animal. " + error);
    }
});

faunaRouter.post("/", async (req, res) => {
    try {
        const validatedData = faunaSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el animal",
                errors: validatedData.error.errors,
            });
        }

        await faunaRepository.save(faunaRepository.create(req.body));
        return res.status(200).send("Animal guardado correctamente");
    } catch (error) {
        return res.status(500).send("Error al guardar el animal. " + error);
    }
});

faunaRouter.put("/:id", async (req, res) => {
    try {
        const validatedData = faunaSchema.safeParse(req.body);

        if (!validatedData.success) {
            return res.status(400).json({
                message: "Error al validar el animal",
                errors: validatedData.error.errors,
            });
        }

        await faunaRepository.update(req.params.id, req.body);
        return res.status(200).send("Animal actualizado correctamente");
    } catch (error) {
        return res.status(500).send("Error al actualizar el animal");
    }
});

faunaRouter.delete("/:id", async (req, res) => {
    try {
        await faunaRepository.delete(req.params.id);
        res.status(200).send("Animal eliminado correctamente");
    } catch (error) {
        res.status(500).send("Error al eliminar el animal");
    }
});

export default faunaRouter;