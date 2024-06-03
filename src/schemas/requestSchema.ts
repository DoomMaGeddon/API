import { z } from 'zod';

export const requestSchema = z.object({
    id: z.number().int(),
    emailUsuario: z.string(),
    fecha: z.date(),
    descripcion: z.string(),
});