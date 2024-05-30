import { z } from 'zod';
import { rankSchema } from './rankSchema';

export const layerSchema = z.object({
    numero: z.number().int(),
    nombre: z.string().max(50),
    rango: rankSchema
});