import { z } from 'zod';

export const rankSchema = z.object({
    id: z.number().int(),
    nombre: z.string().max(15),
    requisito: z.number().int(),
});