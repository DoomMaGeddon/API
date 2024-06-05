import { z } from 'zod';

export const requestSchema = z.object({
    emailUsuario: z.string(),
    fecha: z.string().date(),
    descripcion: z.string().optional(),
});