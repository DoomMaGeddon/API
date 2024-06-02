import { z } from 'zod';
import { entrySchema } from './entrySchema';

export const floraSchema = entrySchema.merge(z.object({
    nombre: z.string().max(50),
    especie: z.string().max(50),
    habitat: z.number(),
    descripcion: z.string(),
}));