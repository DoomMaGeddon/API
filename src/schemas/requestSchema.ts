import { z } from 'zod';
import { userSchema } from './userSchema';

export const requestSchema = z.object({
    id: z.number().int(),
    emailUsuario: userSchema.pick({ email: true }),
    fecha: z.date(),
    descripcion: z.string(),
});