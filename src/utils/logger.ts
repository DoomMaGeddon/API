import express from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

export const requestLogger = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    const token = req.header("auth-token") as string;
    let logEntry = `-> ${new Date().toISOString()} - ${req.method} ${req.url}`;

    if (token) {
        const { rol: tokenRol } = jwt.decode(token) as { rol: string };
        const { email: tokenEmail } = jwt.decode(token) as { email: string };
        logEntry += ` - Email: ${tokenEmail} - Rol: ${tokenRol} - Token: ${token}\n`;
    } else {
        logEntry += ` - Email: ${req.body.email || 'Sin email'}\n`;
    }


    fs.appendFile(path.join('./', 'requests.log'), logEntry, (err) => {
        if (err) {
            console.error('Error registrando la petición en el log', err);
        }
    });

    next();
};