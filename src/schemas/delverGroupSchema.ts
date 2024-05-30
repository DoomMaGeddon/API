import { z } from 'zod';
import { delverSchema } from './delverSchema';
import { entrySchema } from './entrySchema';

export const delverGroupSchema = entrySchema.merge(z.object({
    nombre: z.string().max(50),
    estado: z.string().max(20),
    rango: z.string(),
    lider: delverSchema,
}));
