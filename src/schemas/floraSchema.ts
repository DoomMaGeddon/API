import { z } from 'zod';
import { layerSchema } from './layerSchema';
import { entrySchema } from './entrySchema';

export const floraSchema = entrySchema.merge(z.object({
    nombre: z.string().max(50),
    especie: z.string().max(50),
    habitat: z.array(layerSchema),
    descripcion: z.string(),
}));