import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TOKEN_SECRET } from '../config/env-variables';
import * as blacklistUtil from "./blacklist";
import * as tokenStore from "./tokenStore";

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado" });
    }

    if (blacklistUtil.isTokenRevoked(token)) {
        console.log(`El token ${token} está revocado`);
        return res.status(401).json({ error: "Token revocado" });
    }

    if (!tokenStore.isTokenActive(token)) {
        return res.status(401).json({ error: "Token no coincidente" });
    }

    try {
        jwt.verify(token, TOKEN_SECRET as string);
        next();
        return res.status(200).json({ error: "Token válido, acceso concedido" });
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "TokenExpiredError")
                return res.status(401).json({ error: "Token expirado, acceso denegado" });
            else
                return res.status(400).json({ error: "Token no válido, acceso denegado" });
        } else {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default validateToken;