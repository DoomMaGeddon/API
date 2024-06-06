import { z } from 'zod';

export const entrySchema = z.object({
    foto: z.string().optional().default(''),
    original: z.boolean(),
    creadorEmail: z.string().optional(),
});