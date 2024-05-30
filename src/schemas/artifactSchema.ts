import { z } from 'zod';
import { entrySchema } from './entrySchema';
import { delverSchema } from './delverSchema';

export const artifactSchema = entrySchema.merge(z.object({
    nombre: z.string().max(100),
    grado: z.enum(["Cuarto", "Tercer", "Segundo", "Primer", "Especial", "Aubade", "Desconocido"]),
    efecto: z.string(),
    descripcion: z.string(),
    origen: z.string().optional().default("Desconocido"),
    duenyo: delverSchema,
}));