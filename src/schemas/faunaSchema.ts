import { z } from 'zod';
import { layerSchema } from './layerSchema';
import { entrySchema } from './entrySchema';

export const faunaSchema = entrySchema.merge(z.object({
    nombre: z.string().max(50),
    especie: z.string().max(50),
    habitat: z.array(layerSchema),
    peligro: z.string().max(10),
    dieta: z.string().max(20).optional().default("Desconocido"),
    descripcion: z.string(),
}));