import { z } from 'zod';
import { entrySchema } from './entrySchema';

export const floraSchema = entrySchema.merge(z.object({
    nombre: z.string().max(100),
    especie: z.string().max(100),
    habitat: z.number(),
    descripcion: z.string(),
}));