import { z } from 'zod';
import { userSchema } from './userSchema';

export const entrySchema = z.object({
    id: z.number().int(),
    original: z.boolean(),
    creador: userSchema.optional(),
});