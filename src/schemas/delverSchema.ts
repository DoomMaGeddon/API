import { z } from 'zod';
import { entrySchema } from './entrySchema';
import { rankSchema } from './rankSchema';

export const delverSchema = entrySchema.merge(z.object({
    nombre: z.string().max(100),
    genero: z.string().max(10),
    especie: z.string().max(20),
    estado: z.string().max(20),
    rango: rankSchema
}));