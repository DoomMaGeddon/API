import express from 'express';
import { Solicitudes } from '../entity/Solicitudes';
import { Usuarios } from '../entity/Usuarios';
import datasource from "../db/datasource";
import { requestSchema } from '../schemas/requestSchema';
import validateToken from '../utils/validateToken';
import jwt from 'jsonwebtoken';

const requestRouter = express.Router();
const requestRepository = datasource.getRepository(Solicitudes);
const userRepository = datasource.getRepository(Usuarios);

requestRouter.get("/", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        const requests = await requestRepository.find();
        return res.status(200).send(requests);
    } catch (error) {
        return res.status(500).send(error);
    }
});

requestRouter.get("/:id", async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        const request = await requestRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (request) {
            return res.status(200).json(request);
        } else {
            return res.status(404).send("Petición no encontrada");
        }
    } catch (error) {
        return res.status(500).send("Error al buscar la petición. " + error);
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

requestRouter.put("/:id", validateToken, async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

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
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        await requestRepository.delete(req.params.id);
        return res.status(200).send("Petición eliminada correctamente");
    } catch (error) {
        return res.status(500).send("Error al eliminar la petición");
    }
});

requestRouter.delete("/:id/:approved", async (req, res) => {
    try {
        const { rol: tokenRol } = jwt.decode(req.header("auth-token") as string) as { rol: string };

        if (tokenRol !== "Admin") {
            return res.status(401).json({ error: "Solo los administradores pueden realizar esta acción" });
        }

        const reqId = req.params.id;
        const approved = req.params.approved;

        if (!approved) {
            await requestRepository.delete(reqId);
            return res.status(200).send("Petición rechazada correctamente");
        }

        const request = await requestRepository.findOne({ where: { id: +reqId } });

        if (!request) {
            return res.status(404).send("Petición no encontrada");
        }

        const userEmail = request.emailUsuario;
        const user = await userRepository.findOne({ where: { email: userEmail } });

        if (!user) {
            await requestRepository.delete(reqId);
            return res.status(404).send("Usuario demandante del rol no encontrado")
        }

        user.rol = "Científico";
        user.experiencia = 0;
        user.rangoId = 1;

        const { email, ...data } = user;
        await userRepository.update(userEmail, data);

        await requestRepository.delete(reqId);
        return res.status(200).send("Petición aprobada correctamente");
    } catch (error) {
        return res.status(500).send("Error al eliminar la petición");
    }
});

export default requestRouter;